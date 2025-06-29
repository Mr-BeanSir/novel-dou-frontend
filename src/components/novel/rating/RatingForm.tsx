'use client';

import { useState, useEffect } from 'react';
import { NovelRating } from '@/types/novel';
import { NovelService } from '@/services/novel';
import StarRating from './StarRating';
import { Trash2, Edit3 } from 'lucide-react';

interface RatingFormProps {
  novelId: number;
  userRating?: NovelRating | null;
  onRatingSubmitted?: (rating: NovelRating) => void;
  onRatingDeleted?: () => void;
}

export default function RatingForm({ 
  novelId, 
  userRating, 
  onRatingSubmitted, 
  onRatingDeleted 
}: RatingFormProps) {
  const [rating, setRating] = useState(userRating?.rating || 0);
  const [review, setReview] = useState(userRating?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(!userRating);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userRating) {
      setRating(userRating.rating);
      setReview(userRating.review || '');
      setIsEditing(false);
    }
  }, [userRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('请选择评分');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newRating = await NovelService.submitRating(novelId, rating, review || undefined);
      onRatingSubmitted?.(newRating);
      setIsEditing(false);
    } catch (error) {
      console.error('提交评分失败:', error);
      setError(error instanceof Error ? error.message : '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除评分吗？')) return;

    setIsDeleting(true);
    setError('');

    try {
      await NovelService.deleteRating(novelId);
      setRating(0);
      setReview('');
      setIsEditing(true);
      onRatingDeleted?.();
    } catch (error) {
      console.error('删除评分失败:', error);
      setError(error instanceof Error ? error.message : '删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (userRating) {
      setRating(userRating.rating);
      setReview(userRating.review || '');
      setIsEditing(false);
    } else {
      setRating(0);
      setReview('');
    }
    setError('');
  };

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-6">
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
        {userRating ? '我的评分' : '为这本小说评分'}
      </h3>

      {!isEditing && userRating ? (
        // 显示已有评分
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StarRating rating={userRating.rating} readonly showText />
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {new Date(userRating.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
                title="编辑评分"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                title="删除评分"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {userRating.review && (
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4">
              <p className="text-light-text dark:text-dark-text whitespace-pre-wrap">
                {userRating.review}
              </p>
            </div>
          )}
        </div>
      ) : (
        // 评分表单
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              评分 *
            </label>
            <StarRating 
              rating={rating} 
              onRatingChange={setRating} 
              size="lg" 
              showText 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              评价内容（可选）
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="分享你对这本小说的看法..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent resize-none"
              rows={4}
              maxLength={1000}
            />
            <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
              {review.length}/1000
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? '提交中...' : userRating ? '更新评分' : '提交评分'}
            </button>
            
            {userRating && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-light-text dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                取消
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
