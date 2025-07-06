'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useUser,
  useToken,
  useIsAuthenticated,
  useSetUser,
  useSetToken,
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
 * 避免无限循环问题
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
  const token = useToken();
  const storeIsAuthenticated = useIsAuthenticated();
  const setUser = useSetUser();
  const setToken = useSetToken();
  const setAuthenticated = useSetAuthenticated();
  const clearAuth = useClearAuth();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // 检查是否有 token
        if (!token || !storeIsAuthenticated) {
          // 清空存储
          clearAuth();
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-storage');
          }
          
          if (isMounted) {
            setIsAuthenticated(false);
            setIsUserAdmin(false);
            
            if (requireAuth) {
              router.push('/login');
            }
          }
          return;
        }

        // 获取最新用户信息
        const latestUser = await getCurrentUserLatest();

        if (isMounted) {
          // 更新 store
          setUser(latestUser);
          setAuthenticated(true);

          // 更新本地状态
          setIsAuthenticated(true);

          // 检查管理员权限
          const adminStatus = isAdmin(latestUser);
          setIsUserAdmin(adminStatus);

          // 权限检查
          if (requireAdmin && !adminStatus) {
            console.warn('Access denied: Admin privileges required');
            router.push(redirectTo);
          }
        }

      } catch (error) {
        console.error('Auth check failed:', error);

        if (isMounted) {
          // 只有在 token 相关错误时才清空存储
          if (error instanceof Error && (
            error.message.includes('401') ||
            error.message.includes('Unauthorized') ||
            error.message.includes('token')
          )) {
            console.log('Token invalid, clearing auth');
            clearAuth();
            if (typeof window !== 'undefined') {
              localStorage.removeItem('user-storage');
            }

            setIsAuthenticated(false);
            setIsUserAdmin(false);

            if (requireAuth) {
              router.push('/login');
            }
          } else {
            // 其他错误不清空存储，只设置加载状态
            console.log('Non-auth error, keeping current state');
            setIsAuthenticated(!!user);
            setIsUserAdmin(user ? isAdmin(user) : false);
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
