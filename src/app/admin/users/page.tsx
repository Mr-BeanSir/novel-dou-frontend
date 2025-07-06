'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function AdminUsersPage() {
  return (
    <div className="flex-1">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
        <div className="p-6">
          <UserManagement />
        </div>
      </div>
    </div>
  );
}
