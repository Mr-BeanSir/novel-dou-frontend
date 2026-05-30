// 简化版用户状态管理 (Zustand)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/user';

interface UserState {
  // 状态
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // 操作
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isLoading: false,
      isAuthenticated: false,

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

      // 清除认证信息
      clearAuth: () => {
        set({
          user: null,
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
        isAuthenticated: state.isAuthenticated
      }),

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
export const useIsLoading = () => useUserStore((state) => state.isLoading);

// 操作 hooks
export const useSetUser = () => useUserStore((state) => state.setUser);
export const useSetLoading = () => useUserStore((state) => state.setLoading);
export const useSetAuthenticated = () => useUserStore((state) => state.setAuthenticated);
export const useClearAuth = () => useUserStore((state) => state.clearAuth);
