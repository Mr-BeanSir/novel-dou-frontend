'use client';

import { TagManagement } from '@/components/admin/TagManagement';

export default function AdminTagsPage() {
  return (
    <div className="flex-1">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
        <div className="p-6">
          <TagManagement />
        </div>
      </div>
    </div>
  );
}
