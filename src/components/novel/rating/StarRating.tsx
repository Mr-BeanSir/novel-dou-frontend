'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const RATING_TEXTS = {
  1: '很差',
  2: '较差', 
  3: '一般',
  4: '不错',
  5: '很好'
};

const SIZE_CLASSES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showText = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className="flex items-center gap-1">
      <div 
        className="flex items-center gap-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`
              ${sizeClass}
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              transition-all duration-150
            `}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={readonly}
          >
            <Star
              className={`
                w-full h-full
                ${star <= displayRating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-transparent text-gray-300 dark:text-gray-600'
                }
                transition-colors duration-150
              `}
            />
          </button>
        ))}
      </div>
      
      {showText && displayRating > 0 && (
        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary ml-1">
          {RATING_TEXTS[displayRating as keyof typeof RATING_TEXTS]}
        </span>
      )}
    </div>
  );
}
