// 服务端认证工具函数
// 服务端需要完整 URL 直连后端（nginx 代理只对浏览器生效）
// Node.js fetch 不会自动携带 cookie，需手动从 cookie 读取 token 注入 Authorization 头

import { getAuthCookie } from './cookies';
import { API_CONFIG } from '@/config/api';
import type { User } from '@/types/user';

// 服务端专用的后端 API 地址（SSR 时 fetch 需要完整 URL）
const SERVER_API_BASE_URL = process.env.SERVER_API_BASE_URL || 'http://localhost:8000/api';

/**
 * 服务端API请求函数
 */
async function serverRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${SERVER_API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // 从 httpOnly cookie 读取 token，手动注入 Authorization 头
  const token = await getAuthCookie();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server API request failed:', error);
    throw error;
  }
}

/**
 * 服务端获取当前用户信息
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const response = await serverRequest<{ user: User }>(API_CONFIG.ENDPOINTS.AUTH.ME);
    return response.user;
  } catch (error) {
    console.error('Failed to get server user:', error);
    return null;
  }
}

/**
 * 检查用户是否已认证
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return user !== null;
}

/**
 * 检查用户是否为管理员
 */
export async function isServerAdmin(): Promise<boolean> {
  const user = await getServerUser();
  return user?.user_group?.name === 'admin' || user?.user_group?.name === '管理员';
}

/**
 * 服务端GET请求
 */
export async function serverGet<T>(endpoint: string): Promise<T> {
  return serverRequest<T>(endpoint, { method: 'GET' });
}

/**
 * 服务端POST请求
 */
export async function serverPost<T>(endpoint: string, data?: any): Promise<T> {
  return serverRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * 服务端PUT请求
 */
export async function serverPut<T>(endpoint: string, data?: any): Promise<T> {
  return serverRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * 服务端DELETE请求
 */
export async function serverDelete<T>(endpoint: string): Promise<T> {
  return serverRequest<T>(endpoint, { method: 'DELETE' });
}
