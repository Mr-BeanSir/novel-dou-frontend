// 基于Cookie的用户状态管理 (仅用于客户端组件)

import { create } from 'zustand';
import type { User } from '@/types/user';

interface UserState {
  // 状态
  user: User | null;
  isLoading: boolean;

  // 操作
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // 初始状态
  user: null,
  isLoading: false,

  // 设置用户
  setUser: (user: User | null) => {
    set({ user });
  },

  // 设置加载状态
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  // 清除用户信息
  clearUser: () => {
    set({
      user: null,
      isLoading: false
    });
  },
}));

// 便捷的 hooks
export const useUser = () => useUserStore((state) => state.user);
export const useIsLoading = () => useUserStore((state) => state.isLoading);

// 操作 hooks
export const useSetUser = () => useUserStore((state) => state.setUser);
export const useSetLoading = () => useUserStore((state) => state.setLoading);
export const useClearUser = () => useUserStore((state) => state.clearUser);
