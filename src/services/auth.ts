// 认证相关服务
// 所有请求通过 nginx 反代走同域名，cookie 自动携带

import {get, post} from '@/lib/api';
import {API_CONFIG} from '@/config/api';
import type {ApiResponse, LoginRequest, RegisterRequest, User} from '@/types/user';

/**
 * 认证服务类
 */
export class AuthService {
  /**
   * 用户登录
   */
  static async login(credentials: LoginRequest): Promise<{ user: User; message: string }> {
    const response = await post<{ user: User; message: string }>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    return response;
  }

  /**
   * 用户注册
   */
  static async register(userData: RegisterRequest): Promise<{ user: User; message: string }> {
    const response = await post<{ user: User; message: string }>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData,
    );
    return response;
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
    return response.user || response.data || response;
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<void> {
    try {
      await post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
    // 清除本地认证状态并跳转
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-storage');
      window.location.href = '/login';
    }
  }

  /**
   * 刷新 token
   */
  static async refreshToken(): Promise<any> {
    const response = await post<ApiResponse<any>>(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
    return response.data;
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
}

// 导出便捷方法
export const {
  login,
  register,
  getCurrentUser,
  getCurrentUserLatest,
  logout,
  refreshToken,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  validateToken,
} = AuthService;
