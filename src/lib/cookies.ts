// Cookie 工具函数

import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

/**
 * 服务端设置认证cookie
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
}

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
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

/**
 * 客户端设置认证cookie (用于登录注册)
 */
export function setClientAuthCookie(token: string) {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + COOKIE_OPTIONS.maxAge * 1000);
  
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=${COOKIE_OPTIONS.path}; ${COOKIE_OPTIONS.secure ? 'secure;' : ''} samesite=${COOKIE_OPTIONS.sameSite}`;
}

/**
 * 客户端获取认证token
 */
export function getClientAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === TOKEN_COOKIE_NAME) {
      return value || null;
    }
  }
  return null;
}

/**
 * 客户端删除认证cookie
 */
export function deleteClientAuthCookie() {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${COOKIE_OPTIONS.path};`;
}
