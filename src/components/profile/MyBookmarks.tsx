'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NovelBookmark, PaginatedResponse } from '@/types/novel';
import { getBookmarks, unbookmarkNovel } from '@/services/novel';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

export function MyBookmarks() {
  const [bookmarks, setBookmarks] = useState<NovelBookmark[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<NovelBookmark>, 'data'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookmarks = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getBookmarks(page, 12);
      setBookmarks(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取收藏列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleRemoveBookmark = async (novelId: number) => {
    if (!confirm('确定要取消收藏这部小说吗？')) {
      return;
    }

    try {
      await unbookmarkNovel(novelId);
      setBookmarks(prev => prev.filter(bookmark => bookmark.novel_id !== novelId));
    } catch (err) {
      alert(err instanceof Error ? err.message : '取消收藏失败');
    }
  };

  const handlePageChange = (page: number) => {
    loadBookmarks(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (loading && bookmarks.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 收藏列表 */}
      {!bookmarks || bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
            还没有收藏任何小说
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            去发现一些好看的小说并收藏它们吧
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors font-medium"
          >
            去首页看看
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {bookmarks && bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 封面区域 */}
                <div className="aspect-[3/4] bg-light-border rounded-t-lg relative overflow-hidden">
                  {bookmark.novel?.cover_image ? (
                    <img
                      src={bookmark.novel.cover_image}
                      alt={bookmark.novel.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-light-border to-light-bg-secondary
                                  flex items-center justify-center relative overflow-hidden">
                      {/* 背景装饰 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-light-accent/5 to-transparent"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 bg-light-accent/10 rounded-full"></div>
                      <div className="absolute bottom-4 left-4 w-3 h-3 bg-light-accent/20 rounded-full"></div>

                      <div className="relative z-10 text-center">
                        <svg
                          className="w-10 h-10 text-light-text-secondary/60 mx-auto mb-2
                                   group-hover:text-light-accent/80 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <p className="text-xs text-light-text-secondary/50 font-medium">小说封面</p>
                      </div>
                    </div>
                  )}

                  {/* 收藏时间 */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black/50 text-white rounded-full text-xs">
                      {formatDate(bookmark.created_at)}
                    </span>
                  </div>
                </div>

                {/* 内容区域 */}
                <div className="p-3">
                  {/* 标题 */}
                  <h3 className="font-bold text-sm text-light-text dark:text-dark-text mb-1 line-clamp-2">
                    {bookmark.novel?.title}
                  </h3>

                  {/* 作者 */}
                  <p className="text-light-text-secondary dark:text-dark-text-secondary text-xs mb-2">
                    {bookmark.novel?.author}
                  </p>

                  {/* 阅读进度 */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
                      <span>进度</span>
                      <span>{bookmark.reading_progress}%</span>
                    </div>
                    <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-1.5">
                      <div
                        className="bg-wood-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${bookmark.reading_progress}%` }}
                      />
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-1">
                    <Link
                      href={`/novel/${bookmark.novel_id}`}
                      className="flex-1 px-2 py-1.5 text-center bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded text-xs transition-colors"
                    >
                      阅读
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.novel_id)}
                      className="px-2 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-2 border border-light-border dark:border-dark-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-hover dark:hover:bg-dark-hover"
                >
                  上一页
                </button>

                <span className="px-4 py-2 text-light-text dark:text-dark-text">
                  第 {pagination.current_page} 页，共 {pagination.last_page} 页
                </span>

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-2 border border-light-border dark:border-dark-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-hover dark:hover:bg-dark-hover"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
