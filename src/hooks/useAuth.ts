'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  login as apiLogin, 
  register as apiRegister, 
  logout as apiLogout,
  getCurrentUser,
  isAuthenticated 
} from '@/lib/auth';
import type { User, LoginRequest, RegisterRequest } from '@/types/user';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // 获取用户信息
  const fetchUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      setIsAuth(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuth(true);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 登录
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const authResponse = await apiLogin(credentials);
      setUser(authResponse.user);
      setIsAuth(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 注册
  const register = useCallback(async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const authResponse = await apiRegister(userData);
      setUser(authResponse.user);
      setIsAuth(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuth(false);
      setIsLoading(false);
    }
  }, []);

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // 初始化时获取用户信息
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    isAuthenticated: isAuth,
    login,
    register,
    logout,
    refreshUser,
  };
}
