// 用户状态管理 (Zustand)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  isAuthenticated
} from '@/services/auth';
import type { User, LoginRequest, RegisterRequest } from '@/types/user';

interface UserState {
  // 状态
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // 操作
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;

  // 权限检查
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // 登录
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const authResponse = await apiLogin(credentials);
          const { user, token } = authResponse;

          set({
            user,
            token,
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
          const { user, token } = authResponse;

          set({
            user,
            token,
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
            token: null,
            isAuthenticated: false,
            isLoading: false
          });


        }
      },

      // 刷新用户信息
      refreshUser: async () => {
        const { token } = get();
        if (!token || !isAuthenticated()) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Failed to refresh user:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });

        }
      },

      // 设置用户
      setUser: (user: User | null) => {
        set({ user });
      },

      // 设置 token
      setToken: (token: string | null) => {
        set({ token, isAuthenticated: !!token });

      },

      // 设置加载状态
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // 初始化
      initialize: async () => {
        const { token, user, isAuthenticated } = get();

        if (token && isAuthenticated && !user) {
          // 如果有token且标记为已认证，但没有用户信息，则重新获取
          try {
            const userData = await getCurrentUser();
            set({ user: userData });
          } catch (error) {
            console.error('Failed to initialize user:', error);
            // token 无效，清除状态
            set({
              user: null,
              token: null,
              isAuthenticated: false
            });
          }
        }
      },

      // 权限检查方法
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
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// 便捷的 hooks
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useIsLoading = () => useUserStore((state) => state.isLoading);

// 单独导出每个action
export const useLogin = () => useUserStore((state) => state.login);
export const useRegister = () => useUserStore((state) => state.register);
export const useLogout = () => useUserStore((state) => state.logout);
export const useRefreshUser = () => useUserStore((state) => state.refreshUser);
export const useInitialize = () => useUserStore((state) => state.initialize);

export const useUserPermissions = () => useUserStore((state) => ({
  hasPermission: state.hasPermission,
  hasAnyPermission: state.hasAnyPermission,
  hasAllPermissions: state.hasAllPermissions,
}));
