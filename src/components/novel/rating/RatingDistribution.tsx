'use client';

import type { Novel } from '@/types/novel';

interface RatingDistributionProps {
  novel: Novel;
}

export default function RatingDistribution({ novel }: RatingDistributionProps) {
  const currentRating = parseFloat(novel.rating) || 0;
  
  // 模拟评分分布数据（实际应该从API获取）
  const ratingDistribution = [
    { stars: 5, count: Math.floor(Math.random() * 100) + 50, percentage: 0 },
    { stars: 4, count: Math.floor(Math.random() * 80) + 30, percentage: 0 },
    { stars: 3, count: Math.floor(Math.random() * 60) + 20, percentage: 0 },
    { stars: 2, count: Math.floor(Math.random() * 40) + 10, percentage: 0 },
    { stars: 1, count: Math.floor(Math.random() * 30) + 5, percentage: 0 },
  ];

  // 计算总数和百分比
  const totalCount = ratingDistribution.reduce((sum, item) => sum + item.count, 0);
  ratingDistribution.forEach(item => {
    item.percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
  });

  // 渲染星星
  const renderStars = (rating: number, size: 'small' | 'medium' = 'medium') => {
    const starSize = size === 'small' ? 'text-sm' : 'text-base';
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= Math.round(rating);
      
      return (
        <span
          key={i}
          className={`${starSize} ${
            isFilled ? 'text-yellow-500' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* 总体评分 */}
      <div className="text-center pb-4 border-b border-light-border dark:border-dark-border">
        <div className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
          {currentRating.toFixed(1)}
        </div>
        <div className="flex justify-center mb-2">
          {renderStars(currentRating)}
        </div>
        <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {novel.rating_count} 人评分
        </div>
      </div>

      {/* 评分分布 */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-light-text dark:text-dark-text mb-3">
          评分分布
        </h4>
        {ratingDistribution.map((item) => (
          <div key={item.stars} className="flex items-center space-x-3">
            {/* 星级 */}
            <div className="flex items-center space-x-1 w-16">
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {item.stars}
              </span>
              <span className="text-yellow-500 text-sm">★</span>
            </div>
            
            {/* 进度条 */}
            <div className="flex-1 bg-light-border dark:bg-dark-border rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            
            {/* 百分比和数量 */}
            <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary w-12 text-right">
              {item.percentage.toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      {/* 详细统计 */}
      <div className="pt-3 border-t border-light-border dark:border-dark-border">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-lg font-semibold text-light-text dark:text-dark-text">
              {((ratingDistribution[0].percentage + ratingDistribution[1].percentage)).toFixed(0)}%
            </div>
            <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
              好评率
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-light-text dark:text-dark-text">
              {totalCount}
            </div>
            <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
              总评分
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
