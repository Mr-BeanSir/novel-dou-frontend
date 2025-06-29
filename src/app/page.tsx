'use client';

import { useState, useEffect } from 'react';
import NovelCard from '@/components/novel/card/NovelCard';
import { getRecommendedNovels, getPopularNovels, getRecentNovels } from '@/services/novel';
import { cache } from '@/lib/cache';
import type { Novel } from '@/types/novel';

export default function Home() {
  const [recommendedNovels, setRecommendedNovels] = useState<Novel[]>([]);
  const [popularNovels, setPopularNovels] = useState<Novel[]>([]);
  const [recentNovels, setRecentNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: 实现搜索功能
      console.log('搜索:', searchQuery);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 直接获取真实API数据
        const [recommended, popular, recent] = await Promise.all([
          getRecommendedNovels(8),
          getPopularNovels(8),
          getRecentNovels(8),
        ]);

        setRecommendedNovels(recommended);
        setPopularNovels(popular);
        setRecentNovels(recent);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-theme-border border-t-theme-accent mx-auto mb-6"></div>
          <p className="text-theme-text-secondary text-lg">精彩内容加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-bold text-theme-text mb-2">加载失败</h2>
            <p className="text-theme-text-secondary mb-6">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-theme-accent text-theme-bg rounded-lg
                     hover:bg-theme-accent-hover transition-theme
                     font-medium shadow-lg hover:shadow-xl"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 英雄区域 */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-6
                       bg-gradient-to-r from-theme-text to-theme-accent bg-clip-text">
          欢迎来到读书豆
        </h1>
        <p className="text-lg md:text-xl text-theme-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
          发现优质小说，享受阅读乐趣。海量小说资源，精彩内容等你探索。
        </p>
        
        {/* 搜索框 */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="搜索小说、作者、关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-5 pl-14 pr-16 text-lg
                       bg-theme-bg-secondary border-2 border-theme-border
                       text-theme-text placeholder-theme-text-secondary
                       rounded-2xl focus:outline-none focus:ring-4
                       focus:ring-theme-accent/20 focus:border-theme-accent
                       shadow-lg hover:shadow-xl transition-all duration-300
                       group-hover:border-theme-accent/50"
            />
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg
                className="w-6 h-6 text-theme-text-secondary group-hover:text-theme-accent transition-theme"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-2 top-2 bottom-2 px-6
                       bg-theme-accent text-theme-bg rounded-xl
                       hover:bg-theme-accent-hover hover:shadow-lg
                       transition-all duration-200 flex items-center gap-2
                       font-medium text-sm"
            >
              <span>搜索</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5-5 5M6 12h12"
                />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* 推荐小说 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-theme-text mb-2">
              编辑推荐
            </h2>
            <p className="text-theme-text-secondary">精选优质小说，为您推荐</p>
          </div>
          <a
            href="/recommended"
            className="text-theme-accent hover:text-theme-accent-hover
                     hover:underline transition-theme flex items-center gap-1
                     font-medium"
          >
            查看更多
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedNovels.length > 0 ? (
            recommendedNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-theme-text-secondary">
                暂无推荐小说
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 热门小说 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-theme-text mb-2">
              热门小说
            </h2>
            <p className="text-theme-text-secondary">读者热捧，口碑之选</p>
          </div>
          <a
            href="/popular"
            className="text-theme-accent hover:text-theme-accent-hover
                     hover:underline transition-theme flex items-center gap-1
                     font-medium"
          >
            查看更多
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularNovels.length > 0 ? (
            popularNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-theme-text-secondary">
                暂无热门小说
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 最近更新 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-theme-text mb-2">
              最近更新
            </h2>
            <p className="text-theme-text-secondary">新鲜出炉，持续更新</p>
          </div>
          <a
            href="/recent"
            className="text-theme-accent hover:text-theme-accent-hover
                     hover:underline transition-theme flex items-center gap-1
                     font-medium"
          >
            查看更多
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentNovels.length > 0 ? (
            recentNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-theme-text-secondary">
                暂无最近更新
              </p>
            </div>
          )}
        </div>
      </section>


    </div>
  );
}
