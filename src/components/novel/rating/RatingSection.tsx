'use client';

import { useState } from 'react';
import type { Novel } from '@/types/novel';
import { NovelService } from '@/services/novel';
import { useIsAuthenticated } from '@/stores/user';
import { useToast } from '@/providers/ToastProvider';

interface RatingSectionProps {
  novel: Novel;
}

export default function RatingSection({ novel }: RatingSectionProps) {
  const isAuthenticated = useIsAuthenticated();
  const { showSuccess, showError, showWarning } = useToast();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // 处理评分提交
  const handleRatingSubmit = async () => {
    if (!isAuthenticated) {
      showWarning('请先登录');
      return;
    }

    if (userRating === 0) {
      showWarning('请选择评分');
      return;
    }

    try {
      setIsSubmitting(true);
      await NovelService.submitRating(novel.id, userRating, review || undefined);
      showSuccess('评分成功！');
      setShowReviewForm(false);
      setReview('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      showError('评分失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染星星
  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= rating;

      return (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          className={`text-2xl transition-colors ${
            interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          } ${isFilled ? 'text-yellow-500' : 'text-gray-300'}`}
          onClick={() => interactive && setUserRating(starValue)}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          ★
        </button>
      );
    });
  };

  // 获取评分文本
  const getRatingText = (rating: number): string => {
    if (rating === 0) return '';
    const texts = ['', '很差', '较差', '一般', '不错', '很好'];
    return texts[rating] || '';
  };

  const currentRating = parseFloat(novel.rating) || 0;
  const displayRating = hoverRating || userRating;

  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                    border border-light-border dark:border-dark-border
                    rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
        读者评分
      </h2>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* 评分分布 */}
        <div className="flex-1">
          <h3 className="text-md font-medium text-light-text dark:text-dark-text mb-4">
            评分分布
          </h3>
          <div className="max-w-xs">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary w-8">
                  {star}星
                </span>
                <div className="flex-1 bg-light-border dark:bg-dark-border rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${Math.random() * 100}%` // 这里应该是真实的分布数据
                    }}
                  />
                </div>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary w-8">
                  {Math.floor(Math.random() * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 用户评分区域 */}
        <div className="lg:w-80">
          {isAuthenticated ? (
            <div className="border border-light-border dark:border-dark-border rounded-lg p-4">
              <h3 className="text-md font-medium text-light-text dark:text-dark-text mb-3">
                给这本书评分
              </h3>

              <div className="flex items-center space-x-2 mb-3">
                <div className="flex space-x-1">
                  {renderStars(displayRating, true)}
                </div>
                {displayRating > 0 && (
                  <span className="text-sm text-light-accent dark:text-dark-accent">
                    {getRatingText(displayRating)}
                  </span>
                )}
              </div>

              {userRating > 0 && (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-sm text-light-accent dark:text-dark-accent
                             hover:underline"
                  >
                    {showReviewForm ? '收起评价' : '写个评价'}
                  </button>

                  {showReviewForm && (
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="分享你的阅读感受..."
                      className="w-full p-3 border border-light-border dark:border-dark-border
                               rounded-md bg-light-bg dark:bg-dark-bg
                               text-light-text dark:text-dark-text
                               placeholder-light-text-secondary dark:placeholder-dark-text-secondary
                               focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                               resize-none"
                      rows={3}
                      maxLength={500}
                    />
                  )}

                  <button
                    onClick={handleRatingSubmit}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-light-accent hover:bg-light-accent-hover
                             dark:bg-dark-accent dark:hover:bg-dark-accent-hover
                             text-white rounded-md transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '提交中...' : '提交评分'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-light-border dark:border-dark-border rounded-lg p-4 text-center">
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-3">
                登录后可以给小说评分
              </p>
              <button
                onClick={() => {
                  // 这里应该触发登录弹窗
                  showWarning('请先登录');
                }}
                className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover
                         dark:bg-dark-accent dark:hover:bg-dark-accent-hover
                         text-white rounded-md transition-colors"
              >
                立即登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
