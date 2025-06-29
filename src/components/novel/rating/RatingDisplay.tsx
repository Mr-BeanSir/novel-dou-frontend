'use client';

import type { Novel } from '@/types/novel';

interface RatingDisplayProps {
  novel: Novel;
  size?: 'small' | 'medium' | 'large';
}

export default function RatingDisplay({ novel, size = 'medium' }: RatingDisplayProps) {
  const currentRating = parseFloat(novel.rating) || 0;
  
  // 渲染星星
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= Math.round(rating);
      
      return (
        <span
          key={i}
          className={`${getSizeClasses().star} ${
            isFilled ? 'text-yellow-500' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      );
    });
  };

  // 获取尺寸相关的样式类
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'text-right',
          rating: 'text-lg font-semibold',
          star: 'text-sm',
          count: 'text-xs'
        };
      case 'large':
        return {
          container: 'text-right',
          rating: 'text-3xl font-bold',
          star: 'text-xl',
          count: 'text-sm'
        };
      default: // medium
        return {
          container: 'text-right',
          rating: 'text-xl font-semibold',
          star: 'text-base',
          count: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={sizeClasses.container}>
      <div className={`${sizeClasses.rating} text-light-text dark:text-dark-text mb-1`}>
        {currentRating.toFixed(1)}
      </div>
      <div className="flex justify-end mb-1">
        {renderStars(currentRating)}
      </div>
      <div className={`${sizeClasses.count} text-light-text-secondary dark:text-dark-text-secondary`}>
        {novel.rating_count} 人评分
      </div>
    </div>
  );
}
