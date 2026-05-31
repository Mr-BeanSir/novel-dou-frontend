'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Novel, NovelChapter, PaginatedResponse } from '@/types/novel';
import { getUserNovelChapters, getUserNovelDetail } from '@/services/user-novel';
import { Plus, Upload, Eye, Calendar, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { ChapterUploadModal } from '@/components/profile/ChapterUploadModal';

interface ChapterManageTabProps {
  novelId: number;
}

export function ChapterManageTab({ novelId }: ChapterManageTabProps) {
  const [chapters, setChapters] = useState<NovelChapter[]>([]);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pagination, setPagination] = useState<{
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  } | null>(null);

  const loadChapters = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUserNovelChapters(novelId, {
        page,
        per_page: 20,
        sort_by: 'chapter_number',
        sort_order: 'asc'
      });
      setChapters(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取章节列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [novelId]);

  const loadData = async () => {
    try {
      const [novelData] = await Promise.all([
        getUserNovelDetail(novelId),
        loadChapters()
      ]);
      setNovel(novelData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handlePageChange = (page: number) => {
    loadChapters(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text">章节管理</h3>
          {pagination && (
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              共 {pagination.total} 章
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
          >
            <Upload className="w-4 h-4" />
            批量上传
          </button>
          <Link
            href={`/manage/${novelId}/publish`}
            className="flex items-center gap-2 px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            发布新章节
          </Link>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 章节列表 */}
      {!chapters || chapters.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
            还没有发布章节
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            点击"发布新章节"按钮开始创作您的第一章
          </p>
          <Link
            href={`/manage/${novelId}/publish`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            发布第一章
          </Link>
        </div>
      ) : (
        <>
          {/* 章节表格 */}
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                      章节
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                      字数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                      阅读量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                      发布时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {chapters.map((chapter) => (
                    <tr key={chapter.id} className="hover:bg-light-bg dark:hover:bg-dark-bg transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-light-text dark:text-dark-text">
                            第 {chapter.chapter_number} 章
                          </span>
                          {chapter.is_vip && (
                            <span className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                              VIP
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-light-text dark:text-dark-text font-medium line-clamp-2">
                          {chapter.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          <FileText className="w-4 h-4 mr-1" />
                          {chapter.word_count_formatted}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          <Eye className="w-4 h-4 mr-1" />
                          {chapter.view_count.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(chapter.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          chapter.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {chapter.is_active ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/manage/${novelId}/chapter/${chapter.id}`}
                            className="text-light-accent hover:text-light-accent-hover dark:text-dark-accent dark:hover:text-dark-accent-hover font-medium"
                          >
                            查看
                          </Link>
                          <span className="text-light-border dark:text-dark-border">|</span>
                          <button className="text-light-accent hover:text-light-accent-hover dark:text-dark-accent dark:hover:text-dark-accent-hover font-medium">
                            编辑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 分页 */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                显示第 {pagination.from} - {pagination.to} 条，共 {pagination.total} 条
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-light-border dark:border-dark-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-hover dark:hover:bg-dark-hover"
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一页
                </button>

                <span className="px-4 py-2 text-sm text-light-text dark:text-dark-text">
                  {pagination.current_page} / {pagination.last_page}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="flex items-center gap-1 px-3 py-2 border border-light-border dark:border-dark-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-hover dark:hover:bg-dark-hover"
                >
                  下一页
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 批量上传模态框 */}
      {showUploadModal && novel && (
        <ChapterUploadModal
          novel={novel}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            loadChapters();
          }}
        />
      )}
    </div>
  );
}
