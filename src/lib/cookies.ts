// Cookie 工具函数
// cookie 由后端通过 Set-Cookie 头设置，nginx 代理后同域名自动携带

import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'auth_token';

// cookie 选项（需与后端 Sanctum 配置一致）
const COOKIE_OPTIONS = {
  path: '/',
};

/**
 * 服务端获取认证token
 */
export async function getAuthCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME);
    return token?.value || null;
  } catch (error) {
    console.error('Error getting auth cookie:', error);
    return null;
  }
}

/**
 * 服务端删除认证cookie
 */
export async function deleteAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: TOKEN_COOKIE_NAME,
    ...COOKIE_OPTIONS,
  });
}
