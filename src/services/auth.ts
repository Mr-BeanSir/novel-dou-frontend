// 认证相关服务

import { get, post, setAuthToken, clearAuthToken } from '@/lib/api';
import { API_CONFIG } from '@/config/api';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse
} from '@/types/user';

/**
 * 认证服务类
 */
export class AuthService {
  /**
   * 用户登录
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials,
      false // 登录时不需要认证
    );

    // 保存 token
    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  }

  /**
   * 用户注册
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData,
      false // 注册时不需要认证
    );

    // 保存 token
    if (response.token) {
      setAuthToken(response.token);
    }

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
    const response = await get<ApiResponse<User>>(API_CONFIG.ENDPOINTS.AUTH.ME);
    return response.data;
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<void> {
    try {
      await post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 无论请求是否成功，都清除本地 token
      clearAuthToken();
    }
  }

  /**
   * 刷新 token
   */
  static async refreshToken(): Promise<AuthResponse> {
    const response = await post<ApiResponse<AuthResponse>>(API_CONFIG.ENDPOINTS.AUTH.REFRESH);

    // 更新 token
    if (response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  }

  /**
   * 检查用户是否已登录
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      // 从 Zustand 持久化存储中获取
      const userStorage = localStorage.getItem('user-storage');
      if (userStorage) {
        const parsed = JSON.parse(userStorage);
        return !!(parsed.state?.token && parsed.state?.isAuthenticated);
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * 获取当前 token
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      // 从 Zustand 持久化存储中获取
      const userStorage = localStorage.getItem('user-storage');
      if (userStorage) {
        const parsed = JSON.parse(userStorage);
        return parsed.state?.token || null;
      }
      return null;
    } catch {
      return null;
    }
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
   * 清除认证信息
   */
  static clearAuth(): void {
    clearAuthToken();
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
