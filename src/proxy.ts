import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_CONFIG } from '@/config/api';

// 不需要认证的路径
const PUBLIC_PATHS = ['/login', '/register'];

// 后端 API 地址
const SERVER_API_BASE_URL = process.env.SERVER_API_BASE_URL || 'http://localhost:8000/api';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('auth_token')?.value;
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

  // 有 token 时，向后端验证是否有效
  let isValidToken = false;
  if (token) {
    try {
      const res = await fetch(`${SERVER_API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.ME}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      isValidToken = res.ok;
    } catch {
      isValidToken = false;
    }
  }

  // 未认证 + 非公开页面 → 跳转登录
  if (!isValidToken && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    // 清除无效 token
    if (token) {
      response.cookies.delete('auth_token');
    }
    return response;
  }

  // 已认证 + 访问登录/注册页 → 跳转首页
  if (isValidToken && isPublicPath) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 创建响应，设置路径头信息供服务端组件使用
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|asset|favicon.ico).*)',
  ],
};
