'use client';

import { SystemSettings } from '@/components/admin/SystemSettings';

export default function AdminSettingsPage() {
  return (
    <div className="flex-1">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
        <div className="p-6">
          <SystemSettings />
        </div>
      </div>
    </div>
  );
}
