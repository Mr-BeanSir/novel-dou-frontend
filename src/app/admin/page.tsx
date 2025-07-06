'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { SystemOverview } from '@/components/admin/SystemOverview';

export default function AdminPage() {
  const { isLoading, isAuthenticated, isAdmin, user } = useAdminAuth();

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 如果未通过认证检查，不渲染任何内容（会被重定向）
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex-1">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
        <div className="p-6">
          <SystemOverview />
        </div>
      </div>
    </div>
  );
}
