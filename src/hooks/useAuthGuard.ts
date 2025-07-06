'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userSimple';
import { getCurrentUserLatest, isAdmin } from '@/services/auth';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

interface UseAuthGuardReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
}

/**
 * 页面级别的认证守卫 Hook
 * 用于检查用户登录状态和权限，自动处理重定向
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}): UseAuthGuardReturn {
  const {
    requireAuth = true,
    requireAdmin = false,
    redirectTo = '/login'
  } = options;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const hasChecked = useRef(false);

  const {
    user,
    token,
    setUser,
    setToken,
    isAuthenticated: storeIsAuthenticated
  } = useUserStore();

  useEffect(() => {
    // 防止重复检查
    if (hasChecked.current) {
      return;
    }

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        hasChecked.current = true;

        // 如果没有 token，直接处理未认证状态
        if (!token || !storeIsAuthenticated) {
          // 清空用户存储
          setUser(null);
          setToken(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-storage');
          }

          setIsAuthenticated(false);
          setIsUserAdmin(false);

          // 如果需要认证但用户未登录，重定向到登录页面
          if (requireAuth) {
            router.push('/login');
          }
          return;
        }

        // 调用 /api/users/me 获取最新用户信息
        const latestUser = await getCurrentUserLatest();

        // 更新用户信息到 store
        setUser(latestUser);
        setIsAuthenticated(true);

        // 检查是否为管理员
        const adminStatus = isAdmin(latestUser);
        setIsUserAdmin(adminStatus);

        // 如果需要管理员权限但用户不是管理员，重定向
        if (requireAdmin && !adminStatus) {
          console.warn('Access denied: Admin privileges required');
          router.push(redirectTo);
          return;
        }

      } catch (error) {
        console.error('Auth check failed:', error);

        // 清空用户存储
        setUser(null);
        setToken(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-storage');
        }

        setIsAuthenticated(false);
        setIsUserAdmin(false);

        // 如果需要认证但用户未登录，重定向到登录页面
        if (requireAuth) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // 只在组件挂载时执行一次

  return {
    isLoading,
    isAuthenticated,
    isAdmin: isUserAdmin,
    user
  };
}
