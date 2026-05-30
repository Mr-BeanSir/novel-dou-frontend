'use client';

import { useState } from 'react';
import RankingList from '@/components/ranking/RankingList';
import { NovelService } from '@/services/novel';
import type { Novel, RankingParams } from '@/types/novel';

interface RankingPageContentProps {
  initialNovels: Novel[];
}

export default function RankingPageContent({ initialNovels }: RankingPageContentProps) {
  const [novels, setNovels] = useState<Novel[]>(initialNovels);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rankingParams] = useState<RankingParams>({
    type: 'view',
    period: 'all',
    per_page: 50,
  });

  const handleRankingChange = async (type: string, period: string) => {
    try {
      setLoading(true);
      setError(null);
      const params: RankingParams = {
        type: type as 'view' | 'bookmark' | 'rating',
        period: period as 'all' | 'week' | 'month',
        per_page: 50,
      };
      const data = await NovelService.getRankingNovels(params);
      setNovels(data);
    } catch (err) {
      console.error('Failed to load ranking data:', err);
      setError(err instanceof Error ? err.message : '加载排行榜失败');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-xl font-bold text-light-text mb-2">加载失败</h3>
        <p className="text-light-text-secondary mb-4">{error}</p>
        <button
          onClick={() => handleRankingChange(rankingParams.type, rankingParams.period)}
          className="px-6 py-2 bg-light-accent text-white rounded-lg hover:bg-light-accent-hover transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <RankingList
      initialNovels={novels}
      onTypeChange={handleRankingChange}
      loading={loading}
    />
  );
}
