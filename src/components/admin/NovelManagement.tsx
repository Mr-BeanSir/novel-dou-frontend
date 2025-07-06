'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  StarOff,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { AdminNovel, AdminNovelQuery } from '@/types/admin';
import { AdminService } from '@/services/admin';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { useToast } from '@/providers/ToastProvider';

export function NovelManagement() {
  const { showToast } = useToast();
  const [novels, setNovels] = useState<AdminNovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  // 查询参数
  const [query, setQuery] = useState<AdminNovelQuery>({
    page: 1,
    per_page: 20,
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  // 筛选状态
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadNovels();
  }, [query]);

  const loadNovels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminService.getNovels(query);
      setNovels(response.novels);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load novels:', err);
      setError('加载小说列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setQuery(prev => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1
    }));
  };

  const handleFilterChange = (key: keyof AdminNovelQuery, value: any) => {
    setQuery(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  const handleToggleStatus = async (novel: AdminNovel) => {
    try {
      const updatedNovel = await AdminService.toggleNovelStatus(novel.id);
      setNovels(prev => prev.map(n => n.id === novel.id ? updatedNovel : n));
      showToast(
        updatedNovel.is_active ? '小说已启用' : '小说已禁用',
        'success'
      );
    } catch (err) {
      console.error('Failed to toggle novel status:', err);
      showToast('操作失败', 'error');
    }
  };

  const handleToggleRecommend = async (novel: AdminNovel) => {
    try {
      const updatedNovel = await AdminService.toggleNovelRecommend(novel.id);
      setNovels(prev => prev.map(n => n.id === novel.id ? updatedNovel : n));
      showToast(
        updatedNovel.is_recommended ? '小说已推荐' : '小说已取消推荐',
        'success'
      );
    } catch (err) {
      console.error('Failed to toggle novel recommend:', err);
      showToast('操作失败', 'error');
    }
  };

  const handleDeleteNovel = async (novel: AdminNovel) => {
    if (!confirm(`确定要删除小说《${novel.title}》吗？此操作不可恢复。`)) {
      return;
    }

    try {
      await AdminService.deleteNovel(novel.id);
      setNovels(prev => prev.filter(n => n.id !== novel.id));
      showToast('小说已删除', 'success');
    } catch (err) {
      console.error('Failed to delete novel:', err);
      showToast('删除失败', 'error');
    }
  };

  const getStatusBadge = (novel: AdminNovel) => {
    const statusMap = {
      draft: { label: '草稿', color: 'gray' },
      published: { label: '已发布', color: 'green' },
      completed: { label: '已完结', color: 'blue' },
      paused: { label: '暂停', color: 'yellow' },
      serializing: { label: '连载中', color: 'purple' }
    };
    
    const status = statusMap[novel.status] || statusMap.draft;
    const colorClasses = {
      gray: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
      green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorClasses[status.color as keyof typeof colorClasses]}`}>
        {status.label}
      </span>
    );
  };

  if (loading && novels.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
          小说管理
        </h3>
        <button className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          添加小说
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
              <input
                type="text"
                placeholder="搜索小说标题、作者或简介..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors"
            >
              搜索
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>

        {/* 筛选选项 */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-light-border dark:border-dark-border">
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                状态
              </label>
              <select
                value={query.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              >
                <option value="">全部状态</option>
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="serializing">连载中</option>
                <option value="completed">已完结</option>
                <option value="paused">暂停</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                启用状态
              </label>
              <select
                value={query.is_active === undefined ? '' : query.is_active.toString()}
                onChange={(e) => handleFilterChange('is_active', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              >
                <option value="">全部</option>
                <option value="true">已启用</option>
                <option value="false">已禁用</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                推荐状态
              </label>
              <select
                value={query.is_recommended === undefined ? '' : query.is_recommended.toString()}
                onChange={(e) => handleFilterChange('is_recommended', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              >
                <option value="">全部</option>
                <option value="true">已推荐</option>
                <option value="false">未推荐</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                VIP状态
              </label>
              <select
                value={query.is_vip === undefined ? '' : query.is_vip.toString()}
                onChange={(e) => handleFilterChange('is_vip', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              >
                <option value="">全部</option>
                <option value="true">VIP</option>
                <option value="false">免费</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadNovels}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {/* 小说列表 */}
      <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : novels.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              暂无小说数据
            </p>
          </div>
        ) : (
          <>
            {/* 表格头部 */}
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary px-6 py-3 border-b border-light-border dark:border-dark-border">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                <div className="col-span-3">小说信息</div>
                <div className="col-span-2">作者</div>
                <div className="col-span-1">状态</div>
                <div className="col-span-2">统计</div>
                <div className="col-span-2">标签</div>
                <div className="col-span-2">操作</div>
              </div>
            </div>

            {/* 表格内容 */}
            <div className="divide-y divide-light-border dark:divide-dark-border">
              {novels.map((novel) => (
                <div key={novel.id} className="px-6 py-4 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* 小说信息 */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        {novel.cover_image && (
                          <img
                            src={novel.cover_image}
                            alt={novel.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-light-text dark:text-dark-text truncate">
                            {novel.title}
                          </h4>
                          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                            {novel.category?.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {novel.is_vip && (
                              <span className="px-1.5 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded">
                                VIP
                              </span>
                            )}
                            {novel.is_recommended && (
                              <span className="px-1.5 py-0.5 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded">
                                推荐
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 作者 */}
                    <div className="col-span-2">
                      <p className="font-medium text-light-text dark:text-dark-text">
                        {novel.author}
                      </p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {novel.user?.name}
                      </p>
                    </div>

                    {/* 状态 */}
                    <div className="col-span-1">
                      <div className="space-y-1">
                        {getStatusBadge(novel)}
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            novel.is_active 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`} />
                          <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            {novel.is_active ? '启用' : '禁用'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 统计 */}
                    <div className="col-span-2">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">字数:</span>
                          <span className="text-light-text dark:text-dark-text">{novel.word_count.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">章节:</span>
                          <span className="text-light-text dark:text-dark-text">{novel.chapter_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">阅读:</span>
                          <span className="text-light-text dark:text-dark-text">{novel.view_count}</span>
                        </div>
                      </div>
                    </div>

                    {/* 标签 */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {novel.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 text-xs bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary rounded"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {novel.tags && novel.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary rounded">
                            +{novel.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 操作 */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(novel)}
                          className={`p-1.5 rounded transition-colors ${
                            novel.is_active
                              ? 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900'
                              : 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900'
                          }`}
                          title={novel.is_active ? '禁用' : '启用'}
                        >
                          {novel.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleToggleRecommend(novel)}
                          className={`p-1.5 rounded transition-colors ${
                            novel.is_recommended
                              ? 'text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900'
                              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900'
                          }`}
                          title={novel.is_recommended ? '取消推荐' : '推荐'}
                        >
                          {novel.is_recommended ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                        </button>

                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteNovel(novel)}
                          className="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 分页 */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            显示 {((pagination.current_page - 1) * pagination.per_page) + 1} 到{' '}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} 条，
            共 {pagination.total} 条记录
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="p-2 border border-light-border dark:border-dark-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="px-4 py-2 text-sm">
              {pagination.current_page} / {pagination.last_page}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
              className="p-2 border border-light-border dark:border-dark-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
