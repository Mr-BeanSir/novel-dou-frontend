'use client';

import { CategoryManagement } from '@/components/admin/CategoryManagement';

export default function AdminCategoriesPage() {
  return (
    <div className="flex-1">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
        <div className="p-6">
          <CategoryManagement />
        </div>
      </div>
    </div>
  );
}
