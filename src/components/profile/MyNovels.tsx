'use client';

import { useState, useEffect } from 'react';
import { Novel, UserNovelListParams } from '@/types/novel';
import { PaginatedResponse } from '@/types/novel';
import { getUserNovels } from '@/services/user-novel';
import { CreateNovelModal } from '@/components/profile/CreateNovelModal';
import { MyNovelCard } from '@/components/profile/MyNovelCard';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

export function MyNovels() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Novel>, 'data'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Novel['status'] | ''>('');
  const [sortBy, setSortBy] = useState<UserNovelListParams['sort_by']>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadNovels = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params: UserNovelListParams = {
        page,
        per_page: 12,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await getUserNovels(params);
      setNovels(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取小说列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNovels();
  }, [sortBy, sortOrder, statusFilter]);

  const handleSearch = () => {
    loadNovels(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNovelCreated = (newNovel: Novel) => {
    setNovels(prev => [newNovel, ...prev]);
    setShowCreateModal(false);
  };

  const handlePageChange = (page: number) => {
    loadNovels(page);
  };

  if (loading && (!novels || novels.length === 0)) {
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
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* 搜索框 */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="搜索我的小说..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-wood-primary text-white rounded-lg hover:bg-wood-primary/90 transition-colors"
            >
              搜索
            </button>
          </div>

          {/* 筛选器 */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Novel['status'] | '')}
              className="px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
            >
              <option value="">全部状态</option>
              <option value="draft">草稿</option>
              <option value="serializing">连载中</option>
              <option value="completed">已完结</option>
              <option value="paused">暂停</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as UserNovelListParams['sort_by']);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
            >
              <option value="created_at-desc">创建时间（新到旧）</option>
              <option value="created_at-asc">创建时间（旧到新）</option>
              <option value="updated_at-desc">更新时间（新到旧）</option>
              <option value="updated_at-asc">更新时间（旧到新）</option>
              <option value="title-asc">标题（A-Z）</option>
              <option value="title-desc">标题（Z-A）</option>
              <option value="view_count-desc">阅读量（高到低）</option>
              <option value="view_count-asc">阅读量（低到高）</option>
            </select>
          </div>
        </div>

        {/* 创建小说按钮 */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-2 bg-wood-primary text-white rounded-lg hover:bg-wood-primary/90 transition-colors font-medium"
        >
          + 创建小说
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 小说列表 */}
      {!novels || novels.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
            还没有创建小说
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            点击"创建小说"按钮开始您的创作之旅
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-wood-primary text-white rounded-lg hover:bg-wood-primary/90 transition-colors font-medium"
          >
            创建我的第一部小说
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {novels && novels.map((novel) => (
              <MyNovelCard key={novel.id} novel={novel} onUpdate={loadNovels} />
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

      {/* 创建小说模态框 */}
      {showCreateModal && (
        <CreateNovelModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleNovelCreated}
        />
      )}
    </div>
  );
}
