'use client';

import { useState } from 'react';
import type { NovelRating } from '@/types/novel';
import { NovelService } from '@/services/novel';
import { useUser, useIsAuthenticated } from '@/stores/userSimple';
import { useToast } from '@/providers/ToastProvider';
import StarRating from '../rating/StarRating';

interface CommentSectionProps {
  novelId: number;
  ratings: NovelRating[];
  userRating?: NovelRating | null;
  onRatingUpdate?: () => void;
}

export default function CommentSection({
  novelId,
  ratings,
  userRating,
  onRatingUpdate
}: CommentSectionProps) {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { showSuccess, showError, showWarning } = useToast();
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(userRating?.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 格式化时间
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 提交评分
  const handleSubmitRating = async () => {
    if (!isAuthenticated) {
      showWarning('请先登录');
      return;
    }

    if (rating === 0) {
      showWarning('请选择评分');
      return;
    }

    try {
      setIsSubmitting(true);

      // 提交评分
      await NovelService.submitRating(novelId, rating, newComment.trim() || undefined);

      setNewComment('');
      setRating(0);

      // 通知父组件更新评分数据
      onRatingUpdate?.();

      showSuccess('评分发表成功！');
    } catch (error) {
      console.error('Error submitting rating:', error);
      showError('评分发表失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                    border border-light-border dark:border-dark-border
                    rounded-lg overflow-hidden">
      {/* 发表评论 */}
      {isAuthenticated ? (
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-light-accent dark:bg-dark-accent
                            rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="flex-1">
              {/* 评分选择 */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  为这本小说评分
                </label>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  showText
                />
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评价（可选）..."
                className="w-full p-3 border border-light-border dark:border-dark-border
                         rounded-md bg-light-bg dark:bg-dark-bg
                         text-light-text dark:text-dark-text
                         placeholder-light-text-secondary dark:placeholder-dark-text-secondary
                         focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                         resize-none"
                rows={3}
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {newComment.length}/1000
                </span>
                <button
                  onClick={handleSubmitRating}
                  disabled={isSubmitting || rating === 0}
                  className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover
                           dark:bg-dark-accent dark:hover:bg-dark-accent-hover
                           text-white rounded-md transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '发表中...' : '发表评分'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 border-b border-light-border dark:border-dark-border text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-3">
            登录后可以发表评分
          </p>
          <button
            onClick={() => {
              // 这里应该触发登录弹窗
              alert('请先登录');
            }}
            className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover
                     dark:bg-dark-accent dark:hover:bg-dark-accent-hover
                     text-white rounded-md transition-colors"
          >
            立即登录
          </button>
        </div>
      )}

      {/* 评分列表 */}
      <div className="divide-y divide-light-border dark:divide-dark-border">
        {ratings.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              暂无评分，快来发表第一条评分吧！
            </p>
          </div>
        ) : (
          ratings.map((rating) => (
            <div key={`rating-${rating.id}`} className="p-6">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-light-accent dark:bg-dark-accent
                                rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {rating.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-light-text dark:text-dark-text">
                      {rating.user.name}
                    </span>
                    <StarRating rating={rating.rating} readonly size="sm" showText />
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {formatTime(rating.created_at)}
                    </span>
                  </div>

                  {rating.review && (
                    <p className="text-light-text dark:text-dark-text mb-3 whitespace-pre-wrap">
                      {rating.review}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
