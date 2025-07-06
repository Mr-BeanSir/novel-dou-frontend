'use client';

import { ReactNode } from 'react';
import { usePageAuth } from '@/hooks/usePageAuth';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

interface PageAuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

/**
 * 页面级别的认证守卫组件
 * 用于包装需要认证的页面，自动处理登录状态检查和重定向
 */
export function PageAuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/login',
  loadingComponent
}: PageAuthGuardProps) {
  const { isLoading, isAuthenticated, isAdmin } = usePageAuth({
    requireAuth,
    requireAdmin,
    redirectTo
  });

  // 显示加载状态
  if (isLoading) {
    return loadingComponent || (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 如果需要认证但用户未登录，不渲染内容（会被重定向）
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // 如果需要管理员权限但用户不是管理员，不渲染内容（会被重定向）
  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
