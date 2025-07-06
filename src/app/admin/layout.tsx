'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { AdminNavigation } from '@/components/admin/AdminNavigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
    <AdminNavigation user={user}>
      {children}
    </AdminNavigation>
  );
}
