import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { getServerUser } from '@/lib/auth-server';
import { UserInfo } from '@/components/profile/UserInfo';
import { MyNovels } from '@/components/profile/MyNovels';
import { MyBookmarks } from '@/components/profile/MyBookmarks';
import { ReadingHistory } from '@/components/profile/ReadingHistory';
import { ReadingStatistics } from '@/components/profile/ReadingStatistics';
import ProfileTabs from '@/components/profile/ProfileTabs';

export const dynamic = 'force-dynamic';

type TabType = 'novels' | 'bookmarks' | 'history' | 'statistics';

interface ProfilePageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  // 获取用户信息用于页面显示（认证由 proxy 统一处理，此处一定有值）
  const user = (await getServerUser())!;

  // 从URL参数获取当前标签页
  const { tab } = await searchParams;
  const tabParam = tab as TabType;
  const activeTab: TabType =
    tabParam && ['novels', 'bookmarks', 'history', 'statistics'].includes(tabParam)
      ? tabParam
      : 'novels';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'novels':
        return <MyNovels />;
      case 'bookmarks':
        return <MyBookmarks />;
      case 'history':
        return <ReadingHistory />;
      case 'statistics':
        return <ReadingStatistics />;
      default:
        return <MyNovels />;
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <ProfileLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 用户信息区域 */}
          <UserInfo user={user} />

          {/* 标签页导航 */}
          <div className="mt-8">
            <ProfileTabs activeTab={activeTab} user={user} />

            {/* 标签页内容 */}
            <div className="mt-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </ProfileLayout>
    </div>
  );
}
