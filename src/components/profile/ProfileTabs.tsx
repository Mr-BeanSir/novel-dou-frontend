'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { User } from '@/types/user';

type TabType = 'novels' | 'bookmarks' | 'history' | 'statistics';

interface ProfileTabsProps {
  activeTab: TabType;
  user: User;
}

export default function ProfileTabs({ activeTab, user }: ProfileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs = [
    { id: 'novels' as TabType, label: '我的小说', icon: '📚' },
    { id: 'bookmarks' as TabType, label: '我的收藏', icon: '⭐' },
    { id: 'history' as TabType, label: '阅读历史', icon: '📖' },
    { id: 'statistics' as TabType, label: '阅读统计', icon: '📊' },
  ];

  const handleTabChange = (tabId: TabType) => {
    // 更新URL参数
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (tabId === 'novels') {
      // 如果是默认标签页，移除tab参数
      newSearchParams.delete('tab');
    } else {
      newSearchParams.set('tab', tabId);
    }
    const newUrl = newSearchParams.toString() ? `/profile?${newSearchParams.toString()}` : '/profile';
    router.replace(newUrl);
  };

  return (
    <div className="border-b border-light-border dark:border-dark-border">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`py-3 px-2 border-b-2 font-medium text-lg transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent'
                : 'border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:border-light-border dark:hover:border-dark-border'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
