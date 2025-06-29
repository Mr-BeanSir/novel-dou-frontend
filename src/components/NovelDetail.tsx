'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Novel, NovelChapter, NovelComment } from '@/types/novel';
import { NovelService } from '@/services/novel';
import ChapterList from './ChapterList';
import CommentSection from './CommentSection';
import ActionButtons from './ActionButtons';
import LoadingSpinner from './LoadingSpinner';
import RatingDistribution from './RatingDistribution';

interface NovelDetailProps {
  novel: Novel;
}

export default function NovelDetail({ novel }: NovelDetailProps) {
  const [chapters, setChapters] = useState<NovelChapter[]>([]);
  const [comments, setComments] = useState<NovelComment[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

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

  // 加载章节列表
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setIsLoadingChapters(true);
        const response = await NovelService.getNovelChapters(novel.id, 1, 20);
        setChapters(response.data);
      } catch (error) {
        console.error('Error loading chapters:', error);
      } finally {
        setIsLoadingChapters(false);
      }
    };

    loadChapters();
  }, [novel.id]);

  // 加载评论
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoadingComments(true);
        const response = await NovelService.getComments(novel.id, 1, 10);
        setComments(response.data);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [novel.id]);

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

              {/* 操作按钮 */}
              <div className="mt-auto pt-4">
                <ActionButtons novel={novel} />
              </div>
            </div>

            {/* 右侧：评分分布 */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:border-l lg:border-light-border lg:dark:border-dark-border lg:pl-6">
                <RatingDistribution novel={novel} />
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

      {/* 评论区域 */}
      <div>
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
          读者评论 ({novel.comment_count})
        </h2>
        {isLoadingComments ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <CommentSection novelId={novel.id} comments={comments} />
        )}
      </div>
    </div>
  );
}
