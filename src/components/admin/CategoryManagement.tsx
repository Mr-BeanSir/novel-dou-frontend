'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FolderOpen,
  BookOpen
} from 'lucide-react';
import { AdminCategory, AdminCategoryQuery, CreateCategoryData, UpdateCategoryData } from '@/types/admin';
import { AdminService } from '@/services/admin';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { useToast } from '@/providers/ToastProvider';
import { Pagination } from '@/components/ui/Pagination';

export function CategoryManagement() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  // 查询参数
  const [query, setQuery] = useState<AdminCategoryQuery>({
    page: 1,
    per_page: 20,
    sort_by: 'name',
    sort_order: 'asc'
  });

  // 模态框状态
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategories();
  }, [query]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminService.getCategories(query);
      setCategories(response.categories);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('加载分类列表失败');
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

  const handleCreateCategory = async (data: CreateCategoryData) => {
    try {
      const newCategory = await AdminService.createCategory(data);
      setCategories(prev => [newCategory, ...prev]);
      setShowCreateModal(false);
      showToast('分类创建成功', 'success');
    } catch (err) {
      console.error('Failed to create category:', err);
      showToast('创建失败', 'error');
    }
  };

  const handleUpdateCategory = async (data: UpdateCategoryData) => {
    if (!editingCategory) return;

    try {
      const updatedCategory = await AdminService.updateCategory(editingCategory.id, data);
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? updatedCategory : c));
      setShowEditModal(false);
      setEditingCategory(null);
      showToast('分类更新成功', 'success');
    } catch (err) {
      console.error('Failed to update category:', err);
      showToast('更新失败', 'error');
    }
  };

  const handleDeleteCategory = async (category: AdminCategory) => {
    if (category.novel_count > 0) {
      showToast('该分类下还有小说，无法删除', 'error');
      return;
    }

    if (!confirm(`确定要删除分类"${category.name}"吗？此操作不可恢复。`)) {
      return;
    }

    try {
      await AdminService.deleteCategory(category.id);
      setCategories(prev => prev.filter(c => c.id !== category.id));
      showToast('分类已删除', 'success');
    } catch (err) {
      console.error('Failed to delete category:', err);
      showToast('删除失败', 'error');
    }
  };

  if (loading && categories.length === 0) {
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
          分类管理
        </h3>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加分类
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
                placeholder="搜索分类名称..."
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
            <option value="novel_count-desc">小说数量（多到少）</option>
            <option value="novel_count-asc">小说数量（少到多）</option>
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
            onClick={loadCategories}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {/* 分类列表 */}
      <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="w-12 h-12 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4" />
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              暂无分类数据
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-light-accent dark:bg-dark-accent rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-light-text dark:text-dark-text">
                        {category.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${
                          category.is_active ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                          {category.is_active ? '启用' : '禁用'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setShowEditModal(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 rounded transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      disabled={category.novel_count > 0}
                      className="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={category.novel_count > 0 ? '该分类下有小说，无法删除' : '删除'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {category.description && (
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    <BookOpen className="w-4 h-4" />
                    <span>{category.novel_count} 本小说</span>
                  </div>
                  
                  <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {new Date(category.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
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

      {/* 创建分类模态框 */}
      {showCreateModal && (
        <CategoryModal
          title="添加分类"
          onSubmit={handleCreateCategory}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* 编辑分类模态框 */}
      {showEditModal && editingCategory && (
        <CategoryModal
          title="编辑分类"
          category={editingCategory}
          onSubmit={handleUpdateCategory}
          onClose={() => {
            setShowEditModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

// 分类模态框组件
interface CategoryModalProps {
  title: string;
  category?: AdminCategory;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

function CategoryModal({ title, category, onSubmit, onClose }: CategoryModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    is_active: category?.is_active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('请输入分类名称', 'error');
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
              分类名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              placeholder="请输入分类名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
              分类描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              placeholder="请输入分类描述（可选）"
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
              启用分类
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors"
            >
              {category ? '更新' : '创建'}
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
