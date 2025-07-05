'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useToken, useIsAuthenticated } from '@/stores/userSimple';
import { getCurrentUserLatest, isAdmin } from '@/services/auth';

interface UseAdminAuthReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
}

/**
 * 专门用于管理员页面的认证 Hook
 * 只在必要时调用 API，避免频繁的状态更新
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  
  const user = useUser();
  const token = useToken();
  const storeIsAuthenticated = useIsAuthenticated();

  useEffect(() => {
    let isMounted = true;

    const checkAdminAuth = async () => {
      try {
        setIsLoading(true);

        // 首先检查本地状态
        if (!token || !storeIsAuthenticated) {
          console.log('No token or not authenticated, redirecting to home');
          if (isMounted) {
            setIsAuthenticated(false);
            setIsUserAdmin(false);
            router.push('/');
          }
          return;
        }

        // 如果有用户信息，先检查本地的管理员状态
        if (user) {
          const localAdminStatus = isAdmin(user);
          console.log('Local admin status:', localAdminStatus, 'User group:', user.user_group?.name);
          
          if (isMounted) {
            setIsAuthenticated(true);
            setIsUserAdmin(localAdminStatus);
          }

          // 如果本地检查不是管理员，直接重定向
          if (!localAdminStatus) {
            console.log('User is not admin locally, redirecting');
            router.push('/');
            return;
          }

          // 如果本地是管理员，可以选择性地验证最新状态
          // 这里我们信任本地状态，避免不必要的 API 调用
          return;
        }

        // 如果没有用户信息，调用 API 获取
        console.log('No user info, fetching from API');
        const latestUser = await getCurrentUserLatest();
        
        if (isMounted) {
          const adminStatus = isAdmin(latestUser);
          console.log('API admin status:', adminStatus, 'User group:', latestUser.user_group?.name);
          
          setIsAuthenticated(true);
          setIsUserAdmin(adminStatus);

          // 如果不是管理员，重定向
          if (!adminStatus) {
            console.log('User is not admin, redirecting');
            router.push('/');
          }
        }

      } catch (error) {
        console.error('Admin auth check failed:', error);
        
        if (isMounted) {
          setIsAuthenticated(false);
          setIsUserAdmin(false);
          router.push('/');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAdminAuth();

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
