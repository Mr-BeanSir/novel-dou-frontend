'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReadingHistory as ReadingHistoryType, PaginatedResponse } from '@/types/novel';
import { getReadingHistory, clearReadingHistory } from '@/services/novel';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

export function ReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryType[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<ReadingHistoryType>, 'data'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const loadHistory = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getReadingHistory(page, 15);
      setHistory(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取阅读历史失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!confirm('确定要清除所有阅读历史吗？此操作不可恢复。')) {
      return;
    }

    try {
      setClearing(true);
      await clearReadingHistory();
      setHistory([]);
      setPagination(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : '清除历史失败');
    } finally {
      setClearing(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadHistory(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}秒`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}分钟`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}小时${minutes > 0 ? `${minutes}分钟` : ''}`;
    }
  };

  if (loading && (!history || history.length === 0)) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
          阅读历史
          {pagination && (
            <span className="text-sm font-normal text-light-text-secondary dark:text-dark-text-secondary ml-2">
              共 {pagination.total} 条记录
            </span>
          )}
        </h2>
        
        {history && history.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={clearing}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {clearing ? '清除中...' : '清除历史'}
          </button>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 历史列表 */}
      {!history || history.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
            还没有阅读历史
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            开始阅读一些小说，这里就会显示您的阅读记录
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
          <div className="space-y-4">
            {history && history.map((record) => (
              <div
                key={record.id}
                className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* 小说封面 */}
                  <div className="w-16 h-20 bg-light-border rounded flex-shrink-0 overflow-hidden">
                    {record.novel.cover_image ? (
                      <img
                        src={record.novel.cover_image}
                        alt={record.novel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-light-border to-light-bg-secondary
                                    flex items-center justify-center relative overflow-hidden">
                        {/* 背景装饰 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-light-accent/5 to-transparent"></div>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-light-accent/10 rounded-full"></div>
                        <div className="absolute bottom-1 left-1 w-1 h-1 bg-light-accent/20 rounded-full"></div>

                        <div className="relative z-10">
                          <svg
                            className="w-6 h-6 text-light-text-secondary/60"
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
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 阅读信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-light-text dark:text-dark-text truncate">
                          {record.novel.title}
                        </h3>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                          作者：{record.novel.author}
                        </p>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          章节：{record.chapter.title}
                        </p>
                      </div>
                      
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {formatDate(record.read_at)}
                        </p>
                        <p className="text-sm text-wood-primary mb-2">
                          阅读时长：{record.reading_duration_formatted}
                        </p>

                        {/* 操作按钮 */}
                        <div className="flex space-x-2">
                          <Link
                            href={`/novel/${record.novel_id}`}
                            className="px-3 py-1 border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text rounded hover:bg-[#c49e65]/20 hover:border-[#c49e65] transition-colors text-sm"
                          >
                            查看小说
                          </Link>
                          <Link
                            href={`/novel/${record.novel_id}/chapter/${record.chapter_id}`}
                            className="px-3 py-1 bg-[#c49e65] border border-[#c49e65] text-white rounded hover:bg-[#a9744f] hover:border-[#a9744f] transition-colors text-sm"
                          >
                            继续阅读
                          </Link>
                        </div>
                      </div>
                    </div>
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
