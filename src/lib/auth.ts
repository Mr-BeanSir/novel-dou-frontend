// 认证相关工具函数

import { get, post, setAuthToken, clearAuthToken } from './api';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiResponse 
} from '@/types/user';

// 用户登录
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await post<ApiResponse<AuthResponse>>(
    '/users/login',
    credentials,
    false // 登录时不需要认证
  );
  
  // 保存 token
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  
  return response.data;
}

// 用户注册
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  const response = await post<ApiResponse<AuthResponse>>(
    '/users/register',
    userData,
    false // 注册时不需要认证
  );
  
  // 保存 token
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  
  return response.data;
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<User> {
  const response = await get<ApiResponse<User>>('/users/profile');
  return response.data;
}

// 用户登出
export async function logout(): Promise<void> {
  try {
    await post('/users/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // 无论请求是否成功，都清除本地 token
    clearAuthToken();
  }
}

// 登出所有设备
export async function logoutAll(): Promise<void> {
  try {
    await post('/users/logout-all');
  } catch (error) {
    console.error('Logout all error:', error);
  } finally {
    clearAuthToken();
  }
}

// 检查用户是否已登录
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('auth_token');
  return !!token;
}

// 检查用户权限
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.permissions) return false;
  
  return user.permissions.some(p => p.name === permission);
}

// 检查用户是否有任一权限
export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  if (!user || !user.permissions) return false;
  
  return permissions.some(permission => 
    user.permissions!.some(p => p.name === permission)
  );
}

// 检查用户是否有所有权限
export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  if (!user || !user.permissions) return false;
  
  return permissions.every(permission => 
    user.permissions!.some(p => p.name === permission)
  );
}
