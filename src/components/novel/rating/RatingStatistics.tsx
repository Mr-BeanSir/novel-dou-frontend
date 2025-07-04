'use client';

import { NovelRatingStatistics } from '@/types/novel';
import StarRating from './StarRating';

interface RatingStatisticsProps {
  statistics: NovelRatingStatistics;
}

export default function RatingStatistics({ statistics }: RatingStatisticsProps) {
  const { total_ratings, average_rating, rating_distribution, reviews_count } = statistics;

  // 计算每个评分的百分比
  const getPercentage = (count: number) => {
    if (total_ratings === 0) return 0;
    return Math.round((count / total_ratings) * 100);
  };

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-6">
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
        读者评分
      </h3>
      
      {total_ratings > 0 ? (
        <div className="space-y-4">
          {/* 总体评分 */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-light-text dark:text-dark-text">
                {average_rating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(average_rating)} readonly size="sm" />
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                {total_ratings} 人评分
              </div>
            </div>
            
            {/* 评分分布 */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = rating_distribution[star.toString()] || 0;
                const percentage = getPercentage(count);
                
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        {star}
                      </span>
                      <StarRating rating={star} readonly size="sm" />
                    </div>
                    
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    <div className="w-12 text-right text-light-text-secondary dark:text-dark-text-secondary">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* 评价统计 */}
          {reviews_count > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                其中 {reviews_count} 人写了评价
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-light-text-secondary dark:text-dark-text-secondary">
            暂无评分
          </div>
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
            成为第一个评分的读者吧！
          </div>
        </div>
      )}
    </div>
  );
}
