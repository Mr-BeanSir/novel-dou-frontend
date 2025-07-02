'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useIsAuthenticated, useIsLoading } from '@/stores/user';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { UserInfo } from '@/components/profile/UserInfo';
import { MyNovels } from '@/components/profile/MyNovels';
import { MyBookmarks } from '@/components/profile/MyBookmarks';
import { ReadingHistory } from '@/components/profile/ReadingHistory';
import { ReadingStatistics } from '@/components/profile/ReadingStatistics';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

type TabType = 'novels' | 'bookmarks' | 'history' | 'statistics';

export default function ProfilePage() {
  const router = useRouter();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useIsLoading();
  const [activeTab, setActiveTab] = useState<TabType>('novels');
  const [isHydrated, setIsHydrated] = useState(false);

  // 等待客户端 hydration 完成
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // 只有在 hydration 完成且不在加载状态时才检查认证
    if (isHydrated && !isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router, isHydrated]);

  // 显示加载状态：正在加载或者还未 hydration
  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 如果已经 hydration 完成且不在加载状态，但未认证，则返回 null（此时会触发重定向）
  if (!isAuthenticated || !user) {
    return null;
  }

  const tabs = [
    { id: 'novels' as TabType, label: '我的小说', icon: '📚' },
    { id: 'bookmarks' as TabType, label: '我的收藏', icon: '⭐' },
    { id: 'history' as TabType, label: '阅读历史', icon: '📖' },
    { id: 'statistics' as TabType, label: '阅读统计', icon: '📊' },
  ];

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
            <div className="border-b border-light-border dark:border-dark-border">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200
                      ${
                        activeTab === tab.id
                          ? 'border-wood-primary text-wood-primary'
                          : 'border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:border-light-border dark:hover:border-dark-border'
                      }
                    `}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 标签页内容 */}
          <div className="mt-8">
            {renderTabContent()}
          </div>
        </div>
      </ProfileLayout>
    </div>
  );
}
