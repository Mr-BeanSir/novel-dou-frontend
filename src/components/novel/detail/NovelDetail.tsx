'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Novel, NovelChapter, NovelRating, NovelRatingStatistics } from '@/types/novel';
import { NovelService } from '@/services/novel';
import ChapterList from '../chapter/ChapterList';
import CommentSection from '../comment/CommentSection';
import ActionButtons from './ActionButtons';
import LoadingSpinner from '../../layout/LoadingSpinner';
import RatingStatistics from '../rating/RatingStatistics';

interface NovelDetailProps {
  novel: Novel;
}

export default function NovelDetail({ novel }: NovelDetailProps) {
  const [chapters, setChapters] = useState<NovelChapter[]>([]);
  const [ratings, setRatings] = useState<NovelRating[]>([]);
  const [userRating, setUserRating] = useState<NovelRating | null>(null);
  const [ratingStatistics, setRatingStatistics] = useState<NovelRatingStatistics | null>(null);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [isLoadingRating, setIsLoadingRating] = useState(true);

  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  // 获取状态颜色
  const getStatusColor = (status: Novel['status']): string => {
    const colorMap = {
      draft: 'text-gray-500',
      serializing: 'text-green-600',
      completed: 'text-blue-600',
      paused: 'text-yellow-600',
    };
    return colorMap[status] || 'text-gray-500';
  };

  // 格式化更新时间
  const formatUpdateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) {
      return '刚刚更新';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前更新`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前更新`;
    } else if (diffDays === 1) {
      return '昨天更新';
    } else if (diffDays < 7) {
      return `${diffDays}天前更新`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 获取上次阅读章节信息
  const getLastReadChapterInfo = () => {
    if (novel.user_reading_history) {
      const history = novel.user_reading_history;
      return {
        title: history.chapter.title,
        chapterId: history.chapter_id,
        hasHistory: true
      };
    }
    return {
      title: '暂无阅读记录',
      chapterId: null,
      hasHistory: false
    };
  };

  // 加载章节列表
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setIsLoadingChapters(true);
        const response = await NovelService.getNovelChapters(novel.id, 1, 50);
        setChapters(response.data);
      } catch (error) {
        console.error('Error loading chapters:', error);
      } finally {
        setIsLoadingChapters(false);
      }
    };

    loadChapters();
  }, [novel.id]);



  // 加载评分数据
  useEffect(() => {
    const loadRatingData = async () => {
      try {
        setIsLoadingRating(true);
        console.log('Loading rating data for novel:', novel.id);

        // 并行加载用户评分、评分统计和评分列表
        const [userRatingData, statisticsData, ratingsData] = await Promise.all([
          NovelService.getUserRating(novel.id).catch(() => null),
          NovelService.getRatingStatistics(novel.id),
          NovelService.getRatings(novel.id, 1, 20, true) // 只显示有评价内容的评分
        ]);

        console.log('Rating data loaded:', { userRatingData, statisticsData, ratingsData });
        setUserRating(userRatingData);
        setRatingStatistics(statisticsData);
        setRatings(ratingsData.data);
      } catch (error) {
        console.error('Error loading rating data:', error);
      } finally {
        setIsLoadingRating(false);
      }
    };

    loadRatingData();
  }, [novel.id]);

  // 处理评分更新
  const handleRatingUpdate = async () => {
    try {
      // 重新加载所有评分相关数据
      const [userRatingData, statisticsData, ratingsData] = await Promise.all([
        NovelService.getUserRating(novel.id).catch(() => null),
        NovelService.getRatingStatistics(novel.id),
        NovelService.getRatings(novel.id, 1, 20, true)
      ]);

      setUserRating(userRatingData);
      setRatingStatistics(statisticsData);
      setRatings(ratingsData.data);
    } catch (error) {
      console.error('Error updating rating data:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 小说基本信息 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                      border border-light-border dark:border-dark-border
                      rounded-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
          {/* 封面图片 */}
          <div className="flex-shrink-0 lg:self-stretch">
            <div className="relative w-56 h-72 lg:h-full mx-auto lg:mx-0">
              {novel.cover_image ? (
                <Image
                  src={novel.cover_image}
                  alt={novel.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 192px, 192px"
                />
              ) : (
                <div className="w-full h-full bg-light-border dark:bg-dark-border
                              rounded-lg flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              )}

              {/* 标识 */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {novel.is_vip && (
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                    VIP
                  </div>
                )}
                {novel.is_recommended && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    推荐
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 小说信息和评分 */}
          <div className="flex-1 min-w-0 flex flex-col lg:flex-row gap-6">
            {/* 左侧：小说信息 */}
            <div className="flex-1 min-w-0 flex flex-col justify-between lg:h-full">
              {/* 上部分：标题、作者、分类、标签、统计信息 */}
              <div className="space-y-4">
                {/* 标题和作者 */}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-light-text dark:text-dark-text mb-2">
                    {novel.title}
                  </h1>
                  <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                    作者：{novel.author}
                  </p>
                </div>

                {/* 分类和状态 */}
                <div className="flex flex-wrap items-center gap-4">
                  {novel.category && (
                    <Link
                      href={`/category/${novel.category.slug}`}
                      className="px-3 py-1 bg-light-accent/20 dark:bg-dark-accent/20
                               text-light-accent dark:text-dark-accent rounded-md
                               hover:bg-light-accent/30 dark:hover:bg-dark-accent/30
                               transition-colors text-sm"
                    >
                      {novel.category.name}
                    </Link>
                  )}
                  <span className={`text-sm font-medium ${getStatusColor(novel.status)}`}>
                    {novel.status_text}
                  </span>
                </div>

                {/* 标签 */}
                {novel.tags && novel.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {novel.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 text-xs rounded-full font-medium text-white"
                        style={{
                          backgroundColor: tag.color || '#c49e65',
                          boxShadow: `0 2px 4px ${tag.color || '#c49e65'}20`
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* 统计信息 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-light-text dark:text-dark-text">
                      {novel.word_count_formatted || `${formatNumber(novel.word_count)}字`}
                    </div>
                    <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      字数
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-light-text dark:text-dark-text">
                      {novel.chapter_count}
                    </div>
                    <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      章节
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-light-text dark:text-dark-text">
                      {formatNumber(novel.view_count)}
                    </div>
                    <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      阅读
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-light-text dark:text-dark-text">
                      {formatNumber(novel.bookmark_count)}
                    </div>
                    <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      收藏
                    </div>
                  </div>
                </div>
              </div>

              {/* 更新时间和阅读进度 */}
              <div className="mt-auto pt-4 space-y-3">
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary space-y-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-light-accent dark:text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">更新时间:</span>
                    <span className="ml-2">
                      {novel.last_chapter_at ? formatUpdateTime(novel.last_chapter_at) : '暂无更新'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-light-accent dark:text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-medium">上次阅读章节:</span>
                    {(() => {
                      const chapterInfo = getLastReadChapterInfo();
                      if (chapterInfo.hasHistory && chapterInfo.chapterId) {
                        return (
                          <Link
                            href={`/novel/${novel.id}/chapter/${chapterInfo.chapterId}`}
                            className="ml-2 text-light-accent dark:text-dark-accent hover:text-light-accent-hover dark:hover:text-dark-accent-hover transition-colors cursor-pointer underline"
                          >
                            {chapterInfo.title}
                          </Link>
                        );
                      } else {
                        return (
                          <span className="ml-2">
                            {chapterInfo.title}
                          </span>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* 操作按钮 */}
                <ActionButtons novel={novel} firstChapter={chapters.length > 0 ? chapters[0] : null} />
              </div>
            </div>

            {/* 右侧：评分统计 */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:border-l lg:border-light-border lg:dark:border-dark-border lg:pl-6">
                {isLoadingRating ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : ratingStatistics ? (
                  <RatingStatistics statistics={ratingStatistics} />
                ) : (
                  <div className="text-center py-8 text-light-text-secondary dark:text-dark-text-secondary">
                    暂无评分数据
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 简介 */}
        <div className="mt-6 pt-6 border-t border-light-border dark:border-dark-border">
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
            内容简介
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary
                       leading-relaxed whitespace-pre-wrap">
            {novel.description}
          </p>
        </div>
      </div>

      {/* 章节列表 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
          章节目录
        </h2>
        {isLoadingChapters ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <ChapterList novelId={novel.id} chapters={chapters} />
        )}
      </div>

      {/* 评分区域 */}
      <div>
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
          读者评价 ({ratingStatistics?.total_ratings || 0})
        </h2>
        {isLoadingRating ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <CommentSection
            novelId={novel.id}
            ratings={ratings}
            userRating={userRating}
            onRatingUpdate={handleRatingUpdate}
          />
        )}
      </div>
    </div>
  );
}
