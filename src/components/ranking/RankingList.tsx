'use client';

import { useState } from 'react';
import NovelCard from '@/components/novel/card/NovelCard';
import type { Novel } from '@/types/novel';

interface RankingListProps {
  initialNovels: Novel[];
  onTypeChange?: (type: string, period: string) => void;
  loading?: boolean;
}

export default function RankingList({ 
  initialNovels, 
  onTypeChange,
  loading = false 
}: RankingListProps) {
  const [activeType, setActiveType] = useState('view');
  const [activePeriod, setActivePeriod] = useState('all');

  // 排行榜类型配置
  const rankingTypes = [
    { key: 'view', label: '浏览排行', icon: '👁️' },
    { key: 'bookmark', label: '收藏排行', icon: '❤️' },
    { key: 'rating', label: '评分排行', icon: '⭐' },
  ];

  // 时间段配置
  const periods = [
    { key: 'all', label: '总榜' },
    { key: 'month', label: '月榜' },
    { key: 'week', label: '周榜' },
  ];

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    onTypeChange?.(type, activePeriod);
  };

  const handlePeriodChange = (period: string) => {
    setActivePeriod(period);
    onTypeChange?.(activeType, period);
  };

  return (
    <div className="space-y-6">
      {/* 排行榜类型选择 */}
      <div className="bg-[#F9F3D2] border border-[#E5D5B7] rounded-xl p-6">
        <h2 className="text-2xl font-bold text-theme-text mb-4">排行榜</h2>
        
        {/* 类型选择 */}
        <div className="flex flex-wrap gap-3 mb-4">
          {rankingTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => handleTypeChange(type.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                ${activeType === type.key
                  ? 'bg-[#c49e65] text-white shadow-md'
                  : 'bg-white text-theme-text hover:bg-theme-accent/10 border border-theme-border'
                }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* 时间段选择 */}
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => handlePeriodChange(period.key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
                ${activePeriod === period.key
                  ? 'bg-[#c49e65] text-white'
                  : 'bg-white text-theme-text-secondary hover:bg-theme-text/10 border border-theme-border'
                }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* 排行榜内容 */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-accent"></div>
          </div>
        ) : (
          <>
            {/* 前三名特殊展示 */}
            {initialNovels.length > 0 && (
              <div className="bg-[#F9F3D2] border border-[#E5D5B7] rounded-xl p-6">
                <h3 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  前三甲
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {initialNovels.slice(0, 3).map((novel, index) => (
                    <div key={novel.id} className="relative">
                      {/* 排名徽章 */}
                      <div className={`absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'}`}>
                        {index + 1}
                      </div>
                      <NovelCard novel={novel} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 完整排行榜 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-theme-text">完整排行</h3>
              
              {initialNovels.length > 0 ? (
                <div className="space-y-3">
                  {initialNovels.map((novel, index) => (
                    <div key={novel.id} className="bg-[#F9F3D2] border border-[#E5D5B7] rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        {/* 排名 */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${index < 3 
                            ? index === 0 ? 'bg-yellow-500 text-white' 
                              : index === 1 ? 'bg-gray-400 text-white'
                              : 'bg-orange-500 text-white'
                            : 'bg-theme-bg-secondary text-theme-text-secondary'
                          }`}>
                          {index + 1}
                        </div>

                        {/* 小说信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-theme-text line-clamp-1 mb-1">
                                {novel.title}
                              </h4>
                              <p className="text-sm text-theme-text-secondary">
                                {novel.author}
                              </p>
                            </div>

                            {/* 统计数据 */}
                            <div className="flex items-center gap-6 text-sm text-theme-text-secondary">
                              {activeType === 'view' && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  <span>{novel.view_count.toLocaleString()}</span>
                                </div>
                              )}
                              
                              {activeType === 'bookmark' && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  <span>{novel.bookmark_count.toLocaleString()}</span>
                                </div>
                              )}
                              
                              {activeType === 'rating' && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                  <span>{novel.rating} ({novel.rating_count})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-theme-text-secondary">暂无排行数据</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
