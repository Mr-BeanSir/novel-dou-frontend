'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Tag,
  BookOpen
} from 'lucide-react';
import { AdminTag, AdminTagQuery, CreateTagData, UpdateTagData } from '@/types/admin';
import { AdminService } from '@/services/admin';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { useToast } from '@/providers/ToastProvider';
import { Pagination } from '@/components/ui/Pagination';

export function TagManagement() {
  const { showToast } = useToast();
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  // 查询参数
  const [query, setQuery] = useState<AdminTagQuery>({
    page: 1,
    per_page: 20,
    sort_by: 'name',
    sort_order: 'asc'
  });

  // 模态框状态
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTag, setEditingTag] = useState<AdminTag | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTags();
  }, [query]);

  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminService.getTags(query);
      setTags(response.tags);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load tags:', err);
      setError('加载标签列表失败');
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

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  const handleCreateTag = async (data: CreateTagData) => {
    try {
      const newTag = await AdminService.createTag(data);
      setTags(prev => [newTag, ...prev]);
      setShowCreateModal(false);
      showToast('标签创建成功', 'success');
    } catch (err) {
      console.error('Failed to create tag:', err);
      showToast('创建失败', 'error');
    }
  };

  const handleUpdateTag = async (data: UpdateTagData) => {
    if (!editingTag) return;

    try {
      const updatedTag = await AdminService.updateTag(editingTag.id, data);
      setTags(prev => prev.map(t => t.id === editingTag.id ? updatedTag : t));
      setShowEditModal(false);
      setEditingTag(null);
      showToast('标签更新成功', 'success');
    } catch (err) {
      console.error('Failed to update tag:', err);
      showToast('更新失败', 'error');
    }
  };

  const handleDeleteTag = async (tag: AdminTag) => {
    if ((tag.novel_count ?? 0) > 0) {
      showToast('该标签下还有小说，无法删除', 'error');
      return;
    }

    if (!confirm(`确定要删除标签"${tag.name}"吗？此操作不可恢复。`)) {
      return;
    }

    try {
      await AdminService.deleteTag(tag.id);
      setTags(prev => prev.filter(t => t.id !== tag.id));
      showToast('标签已删除', 'success');
    } catch (err) {
      console.error('Failed to delete tag:', err);
      showToast('删除失败', 'error');
    }
  };

  const getTagColor = (index: number) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
      'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400',
      'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
    ];
    return colors[index % colors.length];
  };

  if (loading && tags.length === 0) {
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
          标签管理
        </h3>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加标签
        </button>
      </div>

      {/* 搜索 */}
      <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
              <input
                type="text"
                placeholder="搜索标签名称..."
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
          
          <select
            value={`${query.sort_by}-${query.sort_order}`}
            onChange={(e) => {
              const [sort_by, sort_order] = e.target.value.split('-');
              setQuery(prev => ({ ...prev, sort_by, sort_order: sort_order as 'asc' | 'desc', page: 1 }));
            }}
            className="px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          >
            <option value="name-asc">名称（A-Z）</option>
            <option value="name-desc">名称（Z-A）</option>
            <option value="novel_count-desc">使用次数（多到少）</option>
            <option value="novel_count-asc">使用次数（少到多）</option>
            <option value="created_at-desc">创建时间（新到旧）</option>
            <option value="created_at-asc">创建时间（旧到新）</option>
          </select>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadTags}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {/* 标签列表 */}
      <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-8">
            <Tag className="w-12 h-12 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4" />
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              暂无标签数据
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tags.map((tag, index) => (
                <div
                  key={tag.id}
                  className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`px-2 py-1 rounded-full text-sm font-medium ${getTagColor(index)}`}>
                      #{tag.name}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingTag(tag);
                          setShowEditModal(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTag(tag)}
                        disabled={(tag.novel_count ?? 0) > 0}
                        className="p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={(tag.novel_count ?? 0) > 0 ? '该标签下有小说，无法删除' : '删除'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {tag.description && (
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3 line-clamp-2">
                      {tag.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-light-text-secondary dark:text-dark-text-secondary">
                      <BookOpen className="w-3 h-3" />
                      <span>{tag.novel_count ?? 0} 本</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        tag.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        {tag.is_active ? '启用' : '禁用'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-2 pt-2 border-t border-light-border dark:border-dark-border">
                    {new Date(tag.created_at).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 分页 */}
      <Pagination
        pagination={{
          current_page: pagination.current_page,
          last_page: pagination.last_page,
          per_page: pagination.per_page,
          total: pagination.total,
          from: ((pagination.current_page - 1) * pagination.per_page) + 1,
          to: Math.min(pagination.current_page * pagination.per_page, pagination.total)
        }}
        onPageChange={handlePageChange}
        showQuickJump={true}
        className="mt-6 p-4 border-t border-light-border dark:border-dark-border"
      />

      {/* 创建标签模态框 */}
      {showCreateModal && (
        <TagModal
          title="添加标签"
          onSubmit={handleCreateTag}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* 编辑标签模态框 */}
      {showEditModal && editingTag && (
        <TagModal
          title="编辑标签"
          tag={editingTag}
          onSubmit={handleUpdateTag}
          onClose={() => {
            setShowEditModal(false);
            setEditingTag(null);
          }}
        />
      )}
    </div>
  );
}

// 标签模态框组件
interface TagModalProps {
  title: string;
  tag?: AdminTag;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

function TagModal({ title, tag, onSubmit, onClose }: TagModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    description: tag?.description || '',
    is_active: tag?.is_active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('请输入标签名称', 'error');
      return;
    }

    await onSubmit(formData);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
          {title}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
              标签名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              placeholder="请输入标签名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
              标签描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              placeholder="请输入标签描述（可选）"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
            />
            <label htmlFor="is_active" className="text-sm text-light-text dark:text-dark-text">
              启用标签
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors"
            >
              {tag ? '更新' : '创建'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
