'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useToken, useIsAuthenticated, useUserStore } from '@/stores/userSimple';
import { getCurrentUserLatest, isAdmin } from '@/services/auth';

interface UseAdminAuthReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
}

/**
 * 直接从 localStorage 获取用户状态
 */
function getStoredUserState() {
  if (typeof window === 'undefined') return null;

  try {
    const userStorage = localStorage.getItem('user-storage');
    if (userStorage) {
      const parsed = JSON.parse(userStorage);
      return {
        token: parsed.state?.token || null,
        isAuthenticated: parsed.state?.isAuthenticated || false,
        user: parsed.state?.user || null
      };
    }
  } catch (e) {
    console.error('Failed to parse user storage:', e);
  }
  return null;
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

        // 首先直接从 localStorage 获取状态，避免依赖 Zustand 的异步恢复
        const storedState = getStoredUserState();

        if (!storedState || !storedState.token || !storedState.isAuthenticated) {
          console.log('No valid authentication found, redirecting to home');
          if (isMounted) {
            setIsAuthenticated(false);
            setIsUserAdmin(false);
            router.push('/');
          }
          return;
        }

        // 检查用户信息（优先使用存储的状态，然后是 Zustand 状态）
        const userToCheck = storedState.user || user;
        if (userToCheck) {
          const localAdminStatus = isAdmin(userToCheck);
          console.log('Local admin status:', localAdminStatus, 'User group:', userToCheck.user_group?.name);

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

          // 如果本地是管理员，信任本地状态
          return;
        }

        // 如果没有用户信息，调用 API 获取
        console.log('No user info, fetching from API');
        const latestUser = await getCurrentUserLatest();

        // 更新 Zustand store
        useUserStore.getState().setUser(latestUser);

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
