import { SystemOverview } from '@/components/admin/SystemOverview';

export default function AdminPage() {
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
