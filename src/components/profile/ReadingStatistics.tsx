'use client';

import { useState, useEffect } from 'react';
import { ReadingStatistics as ReadingStatisticsType, RatingHistory, PaginatedResponse } from '@/types/novel';
import { getReadingStatistics, getRatingHistory } from '@/services/novel';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

export function ReadingStatistics() {
  const [statistics, setStatistics] = useState<ReadingStatisticsType | null>(null);
  const [ratingHistory, setRatingHistory] = useState<RatingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, ratingsData] = await Promise.all([
          getReadingStatistics(),
          getRatingHistory(1, 5), // 只获取最近5条评价记录
        ]);

        setStatistics(statsData);
        setRatingHistory(ratingsData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取统计数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
          暂无统计数据
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          开始阅读一些小说，这里就会显示您的阅读统计
        </p>
      </div>
    );
  }

  const { reading_statistics, rating_statistics } = statistics;

  return (
    <div className="space-y-8">
      {/* 阅读统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-light-accent dark:text-dark-accent mb-2">
            {reading_statistics.total_reading_time_formatted}
          </div>
          <div className="text-light-text-secondary dark:text-dark-text-secondary">
            总阅读时长
          </div>
        </div>

        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-light-accent dark:text-dark-accent mb-2">
            {reading_statistics.total_novels_read}
          </div>
          <div className="text-light-text-secondary dark:text-dark-text-secondary">
            阅读小说数
          </div>
        </div>

        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-light-accent dark:text-dark-accent mb-2">
            {reading_statistics.total_chapters_read}
          </div>
          <div className="text-light-text-secondary dark:text-dark-text-secondary">
            阅读章节数
          </div>
        </div>

        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-light-accent dark:text-dark-accent mb-2">
            {rating_statistics.total_ratings}
          </div>
          <div className="text-light-text-secondary dark:text-dark-text-secondary">
            评价次数
          </div>
        </div>
      </div>

      {/* 最近阅读时长 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
          最近阅读活动
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-2xl font-bold text-light-accent dark:text-dark-accent mb-1">
              {reading_statistics.recent_reading_time_formatted}
            </div>
            <div className="text-light-text-secondary dark:text-dark-text-secondary">
              最近7天阅读时长
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-light-accent dark:text-dark-accent mb-1">
              {rating_statistics.average_rating.toFixed(1)}
            </div>
            <div className="text-light-text-secondary dark:text-dark-text-secondary">
              平均评分
            </div>
          </div>
        </div>
      </div>

      {/* 喜好分类统计 */}
      {reading_statistics.top_categories && reading_statistics.top_categories.length > 0 && (
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
            喜好分类统计
          </h3>
          <div className="space-y-3">
            {reading_statistics.top_categories.map((category, index) => {
              const maxCount = reading_statistics.top_categories[0].read_count;
              const percentage = (category.read_count / maxCount) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm text-light-text dark:text-dark-text">
                    {category.name}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-light-border dark:bg-dark-border rounded-full h-2">
                        <div
                          className="bg-light-accent dark:bg-dark-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary w-12 text-right">
                        {category.read_count}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 最近评价 */}
      {ratingHistory && ratingHistory.length > 0 && (
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
            最近评价
          </h3>
          <div className="space-y-4">
            {ratingHistory.map((rating) => (
              <div key={rating.id} className="border-b border-light-border dark:border-dark-border pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-light-text dark:text-dark-text">
                      {rating.novel?.title || '未知小说'}
                    </h4>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {rating.novel?.author || '未知作者'} · {rating.novel?.category?.name || '未分类'}
                    </p>
                    {rating.review && (
                      <p className="text-sm text-light-text dark:text-dark-text mt-2">
                        {rating.review}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= rating.rating
                              ? 'text-yellow-400'
                              : 'text-light-border dark:text-dark-border'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                      {new Date(rating.created_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 评价统计 */}
      <div className="bg-light-card dark:bg-dark-card rounded-lg p-6">
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
          评价统计
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-wood-primary mb-1">
              {rating_statistics.total_ratings}
            </div>
            <div className="text-light-text-secondary dark:text-dark-text-secondary">
              总评价数
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-wood-primary mb-1">
              {rating_statistics.average_rating.toFixed(1)}
            </div>
            <div className="text-light-text-secondary dark:text-dark-text-secondary">
              平均评分
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-wood-primary mb-1">
              {rating_statistics.reviews_count}
            </div>
            <div className="text-light-text-secondary dark:text-dark-text-secondary">
              有评价内容
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
