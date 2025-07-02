'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useIsAuthenticated } from '@/stores/user';
import { Novel } from '@/types/novel';
import { getNovel } from '@/services/novel';
import { ManageLayout } from '@/components/manage/ManageLayout';
import { NovelDataTab } from '@/components/manage/NovelDataTab';
import { ChapterManageTab } from '@/components/manage/ChapterManageTab';
import { SettingsTab } from '@/components/manage/SettingsTab';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { BarChart3, BookOpen, Settings } from 'lucide-react';

type TabType = 'data' | 'chapters' | 'settings';

export default function ManageNovelPage() {
  const params = useParams();
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('data');

  const novelId = params.novelId as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (novelId) {
      loadNovel();
    }
  }, [novelId, isAuthenticated, router]);

  const loadNovel = async () => {
    try {
      setLoading(true);
      setError(null);

      const novelData = await getNovel(parseInt(novelId));

      // 检查是否是用户自己的小说
      if (novelData.author !== user?.name) {
        setError('您没有权限管理此小说');
        return;
      }

      setNovel(novelData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取小说信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleNovelUpdate = (updatedNovel: Novel) => {
    setNovel(updatedNovel);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <ManageLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </ManageLayout>
    );
  }

  if (error) {
    return (
      <ManageLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
            加载失败
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="px-6 py-3 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors font-medium"
          >
            返回个人中心
          </button>
        </div>
      </ManageLayout>
    );
  }

  if (!novel) {
    return (
      <ManageLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
            小说不存在
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            请检查小说ID是否正确
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="px-6 py-3 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors font-medium"
          >
            返回个人中心
          </button>
        </div>
      </ManageLayout>
    );
  }

  const tabs = [
    {
      id: 'data' as TabType,
      label: '小说数据',
      icon: BarChart3,
      description: '查看小说的阅读量、收藏量等统计数据'
    },
    {
      id: 'chapters' as TabType,
      label: '章节管理',
      icon: BookOpen,
      description: '管理章节列表，发布新章节'
    },
    {
      id: 'settings' as TabType,
      label: '小说设置',
      icon: Settings,
      description: '修改小说信息、分类、标签等设置'
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'data':
        return <NovelDataTab novel={novel} />;
      case 'chapters':
        return <ChapterManageTab novelId={novel.id} />;
      case 'settings':
        return <SettingsTab novel={novel} onUpdate={handleNovelUpdate} />;
      default:
        return <NovelDataTab novel={novel} />;
    }
  };

  return (
    <ManageLayout novelTitle={novel.title} novelId={novelId}>
      <div className="space-y-8">
        {/* 小说基本信息卡片 */}
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 封面 */}
            <div className="flex-shrink-0">
              <div className="w-32 h-42 bg-cover-bg rounded-lg overflow-hidden">
                {novel.cover_image ? (
                  <img
                    src={novel.cover_image}
                    alt={novel.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-2">📖</div>
                      <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        暂无封面
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 信息 */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {novel.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  novel.status === 'serializing' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : novel.status === 'completed'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : novel.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                  {novel.status_text}
                </span>
              </div>

              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                作者：{novel.author}
              </p>

              <p className="text-light-text dark:text-dark-text line-clamp-3">
                {novel.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <span>字数：{novel.word_count_formatted}</span>
                <span>章节：{novel.chapter_count}</span>
                <span>阅读：{novel.view_count.toLocaleString()}</span>
                <span>收藏：{novel.bookmark_count.toLocaleString()}</span>
                {novel.rating && <span>评分：{novel.rating}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="border-b border-light-border dark:border-dark-border">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 flex items-center gap-3
                    ${
                      activeTab === tab.id
                        ? 'border-light-accent text-light-accent'
                        : 'border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:border-light-border dark:hover:border-dark-border'
                    }
                  `}
                  title={tab.description}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 标签页内容 */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </ManageLayout>
  );
}
