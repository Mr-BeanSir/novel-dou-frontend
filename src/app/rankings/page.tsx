'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RankingList from '@/components/ranking/RankingList';
import { NovelService } from '@/services/novel';
import type { Novel, RankingParams } from '@/types/novel';

export default function RankingsPage() {
  const router = useRouter();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 默认排行榜参数
  const [rankingParams, setRankingParams] = useState<RankingParams>({
    type: 'view',
    period: 'all',
    per_page: 50
  });

  // 加载排行榜数据
  const loadRankingData = async (params: RankingParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await NovelService.getRankingNovels(params);
      setNovels(data);
    } catch (err) {
      console.error('Failed to load ranking data:', err);
      setError(err instanceof Error ? err.message : '加载排行榜失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理排行榜类型和时间段变化
  const handleRankingChange = (type: string, period: string) => {
    const newParams: RankingParams = {
      type: type as 'view' | 'bookmark' | 'rating',
      period: period as 'all' | 'week' | 'month',
      per_page: 50
    };
    
    setRankingParams(newParams);
    loadRankingData(newParams);
  };

  // 初始加载
  useEffect(() => {
    loadRankingData(rankingParams);
  }, []);

  // 错误处理
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-bold text-theme-text mb-2">加载失败</h3>
          <p className="text-theme-text-secondary mb-4">{error}</p>
          <button
            onClick={() => loadRankingData(rankingParams)}
            className="px-6 py-2 bg-theme-accent text-white rounded-lg hover:bg-theme-accent-hover transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 页面头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4
                       bg-gradient-to-r from-theme-text to-theme-accent bg-clip-text">
          小说排行榜
        </h1>
        <p className="text-lg md:text-xl text-theme-text-secondary max-w-3xl mx-auto leading-relaxed">
          发现最受欢迎的小说，追踪热门趋势
        </p>
      </div>

      {/* 排行榜统计概览 */}
      <div className="bg-[#F9F3D2] border border-[#E5D5B7] rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-theme-accent">
              📊 浏览排行
            </div>
            <div className="text-sm text-theme-text-secondary">
              根据小说浏览量排序
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-theme-accent">
              ❤️ 收藏排行
            </div>
            <div className="text-sm text-theme-text-secondary">
              根据收藏数量排序
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-theme-accent">
              ⭐ 评分排行
            </div>
            <div className="text-sm text-theme-text-secondary">
              根据用户评分排序
            </div>
          </div>
        </div>
      </div>

      {/* 排行榜内容 */}
      <RankingList
        initialNovels={novels}
        onTypeChange={handleRankingChange}
        loading={loading}
      />

      {/* 说明信息 */}
      <div className="mt-12 bg-[#F9F3D2] border border-[#E5D5B7] rounded-xl p-6">
        <h3 className="text-lg font-bold text-theme-text mb-4">排行榜说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-theme-text-secondary">
          <div>
            <h4 className="font-medium text-theme-text mb-2">📈 浏览排行</h4>
            <p>根据小说的总浏览量进行排序，反映小说的受关注程度。</p>
          </div>
          <div>
            <h4 className="font-medium text-theme-text mb-2">💖 收藏排行</h4>
            <p>根据用户收藏数量排序，体现读者对小说的喜爱程度。</p>
          </div>
          <div>
            <h4 className="font-medium text-theme-text mb-2">⭐ 评分排行</h4>
            <p>根据用户评分的平均值排序，反映小说的质量水平。</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-[#E5D5B7]">
          <h4 className="font-medium text-theme-text mb-2">🕒 时间段说明</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-theme-text-secondary">
            <div>
              <span className="font-medium text-theme-text">总榜：</span>
              统计所有时间的数据
            </div>
            <div>
              <span className="font-medium text-theme-text">月榜：</span>
              统计最近30天的数据
            </div>
            <div>
              <span className="font-medium text-theme-text">周榜：</span>
              统计最近7天的数据
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
