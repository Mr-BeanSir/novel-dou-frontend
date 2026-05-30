import { redirect } from 'next/navigation';
import { getServerUser, isServerAdmin } from '@/lib/auth-server';
import { AdminNavigation } from '@/components/admin/AdminNavigation';

export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 服务端认证检查
  const user = await getServerUser();
  if (!user) {
    redirect('/login');
  }

  // 检查管理员权限
  const isAdmin = await isServerAdmin();
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <AdminNavigation user={user}>
      {children}
    </AdminNavigation>
  );
}
