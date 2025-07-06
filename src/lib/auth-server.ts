// 服务端认证工具函数

import { getAuthCookie } from './cookies';
import type { User } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * 服务端API请求函数
 */
async function serverRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (includeAuth) {
    const token = await getAuthCookie();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
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
    const token = await getAuthCookie();
    if (!token) {
      return null;
    }

    const response = await serverRequest<{ user: User }>('/users/me');
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
