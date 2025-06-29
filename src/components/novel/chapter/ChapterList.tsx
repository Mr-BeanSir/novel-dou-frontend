'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NovelChapter } from '@/types/novel';
import { NovelService } from '@/services/novel';
import LoadingSpinner from '../../layout/LoadingSpinner';

interface ChapterListProps {
  novelId: number;
  chapters: NovelChapter[];
}

export default function ChapterList({ novelId, chapters: initialChapters }: ChapterListProps) {
  const [chapters, setChapters] = useState<NovelChapter[]>(initialChapters);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 加载章节列表
  const loadChapters = async (page: number, order: 'asc' | 'desc' = 'asc') => {
    try {
      setIsLoading(true);
      const response = await NovelService.getNovelChapters(novelId, page, 50);

      // 根据排序顺序处理数据
      const sortedChapters = order === 'desc'
        ? [...response.data].reverse()
        : response.data;

      setChapters(sortedChapters);
      setCurrentPage(response.current_page);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理排序切换
  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    loadChapters(1, newOrder);
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadChapters(page, sortOrder);
    }
  };

  // 格式化章节标题 - 直接使用后端返回的标题
  const formatChapterTitle = (chapter: NovelChapter): string => {
    return chapter.title;
  };

  // 格式化发布时间
  const formatPublishTime = (dateString?: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  if (chapters.length === 0) {
    return (
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                      border border-light-border dark:border-dark-border
                      rounded-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          暂无章节内容
        </p>
      </div>
    );
  }

  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                    border border-light-border dark:border-dark-border
                    rounded-lg overflow-hidden">
      {/* 章节列表头部 */}
      <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
        <div className="text-light-text dark:text-dark-text">
          <span className="font-medium">章节目录</span>
          <span className="ml-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {totalPages > 1
              ? `第 ${(currentPage - 1) * 50 + 1}-${Math.min(currentPage * 50, (currentPage - 1) * 50 + chapters.length)} 章`
              : `共 ${chapters.length} 章`
            }
          </span>
        </div>
        <button
          onClick={handleSortToggle}
          className="flex items-center space-x-2 px-3 py-1 rounded-md
                     bg-light-accent/10 dark:bg-dark-accent/10
                     text-light-accent dark:text-dark-accent
                     hover:bg-light-accent/20 dark:hover:bg-dark-accent/20
                     transition-colors text-sm"
        >
          <span>{sortOrder === 'asc' ? '正序' : '倒序'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={sortOrder === 'asc'
                    ? "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    : "M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"} />
          </svg>
        </button>
      </div>

      {/* 章节列表 */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/novel/${novelId}/chapter/${chapter.id}`}
              className={`block h-16 p-2 hover:bg-light-bg dark:hover:bg-dark-bg
                         transition-colors group border-light-border dark:border-dark-border
                         ${index % 4 !== 3 ? 'border-r' : ''}
                         ${Math.floor(index / 4) !== Math.floor((chapters.length - 1) / 4) ? 'border-b' : ''}`}
            >
              <div className="h-full flex flex-col justify-between">
                {/* 顶部：标题和箭头 */}
                <div className="flex items-center justify-between">
                  <h3 className="text-light-text dark:text-dark-text
                               group-hover:text-light-accent dark:group-hover:text-dark-accent
                               transition-colors text-sm font-medium truncate pr-2">
                    {formatChapterTitle(chapter)}
                  </h3>
                  <svg className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary
                                 group-hover:text-light-accent dark:group-hover:text-dark-accent
                                 transition-colors flex-shrink-0"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* 底部：字数和时间 */}
                <div className="flex items-center justify-between text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{chapter.word_count}字</span>
                    {chapter.is_vip && (
                      <span className="px-1 py-0.5 bg-yellow-500 text-white rounded text-xs">
                        VIP
                      </span>
                    )}
                  </div>
                  <div>
                    {chapter.published_at && (
                      <span className="font-medium">{formatPublishTime(chapter.published_at)}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-light-border dark:border-dark-border">
          {/* 分页信息 */}
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            第 {currentPage} 页 / 共 {totalPages} 页
          </div>

          {/* 分页控件 */}
          <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-light-border dark:border-dark-border
                       text-light-text dark:text-dark-text
                       hover:bg-light-bg dark:hover:bg-dark-bg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            上一页
          </button>

          <div className="flex items-center space-x-1">
            {(() => {
              const pages = [];
              const maxVisible = 5;
              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let endPage = Math.min(totalPages, startPage + maxVisible - 1);

              // 调整起始页，确保显示足够的页码
              if (endPage - startPage + 1 < maxVisible) {
                startPage = Math.max(1, endPage - maxVisible + 1);
              }

              // 显示第一页
              if (startPage > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 rounded-md transition-colors text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg"
                  >
                    1
                  </button>
                );
                if (startPage > 2) {
                  pages.push(<span key="ellipsis1" className="px-2 text-light-text-secondary dark:text-dark-text-secondary">...</span>);
                }
              }

              // 显示中间页码
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      i === currentPage
                        ? 'bg-light-accent dark:bg-dark-accent text-white'
                        : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              // 显示最后一页
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(<span key="ellipsis2" className="px-2 text-light-text-secondary dark:text-dark-text-secondary">...</span>);
                }
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 rounded-md transition-colors text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg"
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-light-border dark:border-dark-border
                       text-light-text dark:text-dark-text
                       hover:bg-light-bg dark:hover:bg-dark-bg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            下一页
          </button>
          </div>

          {/* 快速跳转 */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">跳转到</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                }
              }}
              className="w-16 px-2 py-1 text-center border border-light-border dark:border-dark-border
                       rounded bg-light-bg dark:bg-dark-bg
                       text-light-text dark:text-dark-text
                       focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            />
            <span className="text-light-text-secondary dark:text-dark-text-secondary">页</span>
          </div>
        </div>
      )}
    </div>
  );
}
