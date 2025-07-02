'use client';

import { useState, useEffect } from 'react';
import { Novel, NovelCategory, NovelTag, UpdateNovelRequest } from '@/types/novel';
import { updateNovel } from '@/services/user-novel';
import { getCategories, getTags } from '@/services/novel';
import { AlertTriangle, Save, X } from 'lucide-react';

interface SettingsTabProps {
  novel: Novel;
  onUpdate: (updatedNovel: Novel) => void;
}

export function SettingsTab({ novel, onUpdate }: SettingsTabProps) {
  const [categories, setCategories] = useState<NovelCategory[]>([]);
  const [tags, setTags] = useState<NovelTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    title: novel.title,
    description: novel.description,
    category_id: novel.category?.id || 0,
    status: novel.status,
    is_vip: novel.is_vip,
    is_active: novel.is_active,
    tag_ids: novel.tags?.map(tag => tag.id) || []
  });

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    loadCategoriesAndTags();
  }, []);

  const loadCategoriesAndTags = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        getCategories(),
        getTags()
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (err) {
      setError('获取分类和标签失败');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter(id => id !== tagId)
        : [...prev.tag_ids, tagId]
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updateData: UpdateNovelRequest = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        status: formData.status,
        is_vip: formData.is_vip,
        is_active: formData.is_active,
        tag_ids: formData.tag_ids
      };

      const updatedNovel = await updateNovel(novel.id, updateData);
      onUpdate(updatedNovel);
      setSuccess('设置保存成功');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setLoading(true);
      setError(null);

      const updateData: UpdateNovelRequest = {
        is_active: false
      };

      const updatedNovel = await updateNovel(novel.id, updateData);
      onUpdate(updatedNovel);
      setShowDeactivateModal(false);
      setSuccess('小说已下架');
    } catch (err) {
      setError(err instanceof Error ? err.message : '下架失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 消息提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {/* 基本设置 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-6">基本设置</h3>

        <div className="space-y-6">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              小说标题
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              placeholder="请输入小说标题"
            />
          </div>

          {/* 简介 */}
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              小说简介
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent resize-none"
              placeholder="请输入小说简介"
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              分类
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            >
              <option value={0}>请选择分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 状态 */}
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              连载状态
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            >
              <option value="draft">草稿</option>
              <option value="serializing">连载中</option>
              <option value="completed">已完结</option>
              <option value="paused">暂停</option>
            </select>
          </div>

          {/* VIP设置 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_vip"
              checked={formData.is_vip}
              onChange={(e) => handleInputChange('is_vip', e.target.checked)}
              className="w-4 h-4 text-light-accent focus:ring-light-accent border-light-border rounded"
            />
            <label htmlFor="is_vip" className="text-sm font-medium text-light-text dark:text-dark-text">
              VIP小说
            </label>
          </div>

          {/* 上架状态 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="w-4 h-4 text-light-accent focus:ring-light-accent border-light-border rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-light-text dark:text-dark-text">
              上架状态
            </label>
          </div>
        </div>
      </div>

      {/* 标签设置 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-6">标签设置</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.tag_ids.includes(tag.id)
                  ? 'border-light-accent bg-light-accent/10 text-light-accent'
                  : 'border-light-border dark:border-dark-border hover:border-light-accent/50'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.tag_ids.includes(tag.id)}
                onChange={() => handleTagToggle(tag.id)}
                className="w-4 h-4 text-light-accent focus:ring-light-accent border-light-border rounded"
              />
              <span className="text-sm font-medium">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 危险操作 */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          危险操作
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">下架小说</h4>
            <p className="text-sm text-red-500 dark:text-red-300 mb-4">
              下架后，读者将无法搜索和阅读此小说。您可以随时重新上架。
            </p>
            <button
              onClick={() => setShowDeactivateModal(true)}
              disabled={!novel.is_active}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {novel.is_active ? '下架小说' : '已下架'}
            </button>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          {loading ? '保存中...' : '保存设置'}
        </button>
      </div>

      {/* 下架确认模态框 */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text">确认下架</h3>
            </div>

            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
              确定要下架《{novel.title}》吗？下架后读者将无法搜索和阅读此小说。
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeactivate}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {loading ? '下架中...' : '确认下架'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
