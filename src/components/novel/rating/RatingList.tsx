'use client';

import { useState, useEffect } from 'react';
import { NovelRating } from '@/types/novel';
import { NovelService } from '@/services/novel';
import StarRating from './StarRating';
import { ChevronDown, Filter } from 'lucide-react';

interface RatingListProps {
  novelId: number;
}

export default function RatingList({ novelId }: RatingListProps) {
  const [ratings, setRatings] = useState<NovelRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRating, setFilterRating] = useState<number | undefined>();
  const [showReviewsOnly, setShowReviewsOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const loadRatings = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await NovelService.getRatings(
        novelId, 
        page, 
        10, 
        showReviewsOnly || undefined,
        filterRating
      );
      
      if (page === 1) {
        setRatings(response.data);
      } else {
        setRatings(prev => [...prev, ...response.data]);
      }
      
      setCurrentPage(response.current_page);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error('加载评分列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRatings(1);
  }, [novelId, filterRating, showReviewsOnly]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      loadRatings(currentPage + 1);
    }
  };

  const handleFilterChange = (rating?: number) => {
    setFilterRating(rating);
    setCurrentPage(1);
  };

  const handleReviewFilterChange = (showOnly: boolean) => {
    setShowReviewsOnly(showOnly);
    setCurrentPage(1);
  };

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
          读者评价
        </h3>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
        >
          <Filter className="w-4 h-4" />
          筛选
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="mb-6 p-4 bg-light-bg dark:bg-dark-bg rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              按评分筛选
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleFilterChange(undefined)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filterRating === undefined
                    ? 'bg-light-accent dark:bg-dark-accent text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                全部
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange(rating)}
                  className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-colors ${
                    filterRating === rating
                      ? 'bg-light-accent dark:bg-dark-accent text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {rating}
                  <StarRating rating={1} readonly size="sm" />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm text-light-text dark:text-dark-text">
              <input
                type="checkbox"
                checked={showReviewsOnly}
                onChange={(e) => handleReviewFilterChange(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-light-accent dark:text-dark-accent focus:ring-light-accent dark:focus:ring-dark-accent"
              />
              只显示有评价内容的
            </label>
          </div>
        </div>
      )}

      {/* 评分列表 */}
      <div className="space-y-4">
        {loading && ratings.length === 0 ? (
          <div className="text-center py-8 text-light-text-secondary dark:text-dark-text-secondary">
            加载中...
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-8 text-light-text-secondary dark:text-dark-text-secondary">
            暂无评价
          </div>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center text-white font-medium">
                    {rating.user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-light-text dark:text-dark-text">
                      {rating.user.name}
                    </span>
                    <StarRating rating={rating.rating} readonly size="sm" showText />
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {rating.review && (
                    <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-3 mt-2">
                      <p className="text-light-text dark:text-dark-text whitespace-pre-wrap">
                        {rating.review}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 加载更多 */}
      {currentPage < totalPages && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </div>
  );
}
