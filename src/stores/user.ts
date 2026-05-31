// 用户状态管理 (Zustand)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  getCurrentUserLatest,
  isAdmin as checkIsAdmin
} from '@/services/auth';
import type { User, LoginRequest, RegisterRequest } from '@/types/user';

interface UserState {
  // 状态
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // 操作
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  initialize: () => Promise<void>;

  // 权限检查
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isAdmin: () => boolean;
  refreshUserLatest: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // 登录
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const authResponse = await apiLogin(credentials);
          const { user } = authResponse;

          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // 注册
      register: async (userData: RegisterRequest) => {
        set({ isLoading: true });
        try {
          const authResponse = await apiRegister(userData);
          const { user } = authResponse;

          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // 登出
      logout: async () => {
        set({ isLoading: true });
        try {
          await apiLogout();
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      // 刷新用户信息
      refreshUser: async () => {
        set({ isLoading: true });
        try {
          const user = await getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Failed to refresh user:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      // 设置用户
      setUser: (user: User | null) => {
        set({ user });
      },

      // 设置加载状态
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // 设置认证状态
      setAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },

      // 初始化 - 始终用 cookie 向后端验证，不依赖 localStorage
      initialize: async () => {
        set({ isLoading: true });
        try {
          const user = await getCurrentUserLatest();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Failed to initialize user:', error);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      // 权限检查
      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user || !user.permissions) return false;
        return user.permissions.some(p => p.name === permission);
      },

      hasAnyPermission: (permissions: string[]) => {
        const { user } = get();
        if (!user || !user.permissions) return false;
        return permissions.some(permission =>
          user.permissions!.some(p => p.name === permission)
        );
      },

      hasAllPermissions: (permissions: string[]) => {
        const { user } = get();
        if (!user || !user.permissions) return false;
        return permissions.every(permission =>
          user.permissions!.some(p => p.name === permission)
        );
      },

      isAdmin: () => {
        const { user } = get();
        if (!user || !user.user_group) return false;
        return user.user_group.name === '管理员' || user.user_group.name === 'admin';
      },

      // 使用 me 接口刷新用户信息
      refreshUserLatest: async () => {
        try {
          const userData = await getCurrentUserLatest();
          set({ user: userData });
        } catch (error) {
          console.error('Failed to refresh user with latest data:', error);
          set({
            user: null,
            isAuthenticated: false
          });
          throw error;
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),

      // 版本控制
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // 从旧版本迁移：移除 token 字段
        if (version < 2) {
          return {
            user: persistedState?.user || null,
            isAuthenticated: !!persistedState?.isAuthenticated
          };
        }
        return persistedState;
      },
    }
  )
);

// 便捷的 hooks
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
