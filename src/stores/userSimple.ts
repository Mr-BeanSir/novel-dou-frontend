// 简化版用户状态管理 (Zustand)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/user';

interface UserState {
  // 状态
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // 操作
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // 设置用户
      setUser: (user: User | null) => {
        set({ user });
      },

      // 设置 token
      setToken: (token: string | null) => {
        set({ 
          token, 
          isAuthenticated: !!token 
        });
      },

      // 设置加载状态
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // 设置认证状态
      setAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },

      // 清除认证信息
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
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

      version: 1,
      migrate: (persistedState: any, version: number) => {
        // 如果版本为 0 或未定义，说明是旧版本或首次加载
        if (version === 0 || version === undefined) {
          // 返回当前版本的默认状态
          return {
            user: persistedState?.user || null,
            token: persistedState?.token || null,
            isAuthenticated: !!(persistedState?.token || persistedState?.isAuthenticated)
          };
        }
        // 如果版本匹配，直接返回持久化状态
        return persistedState;
      },
    }
  )
);

// 便捷的 hooks
export const useUser = () => useUserStore((state) => state.user);
export const useToken = () => useUserStore((state) => state.token);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useIsLoading = () => useUserStore((state) => state.isLoading);

// 操作 hooks
export const useSetUser = () => useUserStore((state) => state.setUser);
export const useSetToken = () => useUserStore((state) => state.setToken);
export const useSetLoading = () => useUserStore((state) => state.setLoading);
export const useSetAuthenticated = () => useUserStore((state) => state.setAuthenticated);
export const useClearAuth = () => useUserStore((state) => state.clearAuth);
