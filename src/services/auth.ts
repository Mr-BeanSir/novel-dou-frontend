// 认证相关服务

import {get, post} from '@/lib/api';
import {API_CONFIG} from '@/config/api';
import type {ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User} from '@/types/user';

/**
 * 认证服务类
 */
export class AuthService {
  /**
   * 用户登录 - 使用内部API路由
   */
  static async login(credentials: LoginRequest): Promise<{ user: User; message: string }> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '登录失败');
    }

    const data = await response.json();
    return data;
  }

  /**
   * 用户注册 - 使用内部API路由
   */
  static async register(userData: RegisterRequest): Promise<{ user: User; message: string }> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '注册失败');
    }

    const data = await response.json();
    return data;
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<User> {
    const response = await get<ApiResponse<User>>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

  /**
   * 获取最新用户信息 (用于页面访问时的状态检查)
   */
  static async getCurrentUserLatest(): Promise<User> {
    const response = await get<any>(API_CONFIG.ENDPOINTS.AUTH.ME);
    // /api/users/me 接口可能直接返回用户对象，也可能包装在 data 字段中
    return response.user || response.data || response;
  }

  /**
   * 用户登出 - 使用内部API路由
   */
  static async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    // 登出后刷新页面以清除客户端状态
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * 刷新 token
   */
  static async refreshToken(): Promise<AuthResponse> {
    const response = await post<ApiResponse<AuthResponse>>(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
    return response.data;
  }

  /**
   * 检查用户是否已登录 (仅用于客户端组件，服务端请使用 isServerAuthenticated)
   */
  static isAuthenticated(): boolean {
    // 客户端认证检查现在通过服务端验证
    // 这个方法主要用于兼容性，实际认证应该在服务端进行
    return false;
  }

  /**
   * 获取当前 token (已废弃，token现在存储在httpOnly cookie中)
   */
  static getToken(): string | null {
    // token现在存储在httpOnly cookie中，客户端无法直接访问
    return null;
  }

  /**
   * 检查用户权限
   */
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.permissions) return false;

    return user.permissions.some(p => p.name === permission);
  }

  /**
   * 检查用户是否有任一权限
   */
  static hasAnyPermission(user: User | null, permissions: string[]): boolean {
    if (!user || !user.permissions) return false;

    return permissions.some(permission =>
      user.permissions!.some(p => p.name === permission)
    );
  }

  /**
   * 检查用户是否有所有权限
   */
  static hasAllPermissions(user: User | null, permissions: string[]): boolean {
    if (!user || !user.permissions) return false;

    return permissions.every(permission =>
      user.permissions!.some(p => p.name === permission)
    );
  }

  /**
   * 检查用户是否为管理员
   */
  static isAdmin(user: User | null): boolean {
    if (!user || !user.user_group) return false;

    // 根据用户组名称判断是否为管理员
    return user.user_group.name === '管理员' || user.user_group.name === 'admin';
  }

  /**
   * 验证 token 是否有效
   */
  static async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 清除认证信息 (已废弃，现在使用logout方法)
   */
  static clearAuth(): void {
    // 认证信息现在存储在httpOnly cookie中，需要通过logout API清除
    console.warn('clearAuth is deprecated, use logout() instead');
  }
}

// 导出便捷方法
export const {
  login,
  register,
  getCurrentUser,
  getCurrentUserLatest,
  logout,
  refreshToken,
  isAuthenticated,
  getToken,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  validateToken,
  clearAuth,
} = AuthService;
