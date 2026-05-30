'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useUser,
  useIsAuthenticated,
  useSetUser,
  useSetAuthenticated,
  useClearAuth
} from '@/stores/userSimple';
import { getCurrentUserLatest, isAdmin } from '@/services/auth';

interface UsePageAuthOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

interface UsePageAuthReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
}

/**
 * 简化版的页面认证 Hook
 * cookie 由后端自动设置，通过 API 请求验证认证状态
 */
export function usePageAuth(options: UsePageAuthOptions = {}): UsePageAuthReturn {
  const {
    requireAuth = true,
    requireAdmin = false,
    redirectTo = '/'
  } = options;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const user = useUser();
  const storeIsAuthenticated = useIsAuthenticated();
  const setUser = useSetUser();
  const setAuthenticated = useSetAuthenticated();
  const clearAuth = useClearAuth();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // 获取最新用户信息（cookie 自动携带）
        const latestUser = await getCurrentUserLatest();

        if (isMounted) {
          setUser(latestUser);
          setAuthenticated(true);
          setIsAuthenticated(true);

          const adminStatus = isAdmin(latestUser);
          setIsUserAdmin(adminStatus);

          if (requireAdmin && !adminStatus) {
            console.warn('Access denied: Admin privileges required');
            router.push(redirectTo);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);

        if (isMounted) {
          clearAuth();
          setIsAuthenticated(false);
          setIsUserAdmin(false);

          if (requireAuth) {
            router.push('/login');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []); // 只在挂载时执行

  return {
    isLoading,
    isAuthenticated,
    isAdmin: isUserAdmin,
    user
  };
}
