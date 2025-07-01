'use client';

import { useState, useEffect } from 'react';
import { Novel, NovelCategory, NovelTag, CreateNovelRequest } from '@/types/novel';
import { createNovel, getCategories, getTags } from '@/services/user-novel';

interface CreateNovelModalProps {
  onClose: () => void;
  onSuccess: (novel: Novel) => void;
}

export function CreateNovelModal({ onClose, onSuccess }: CreateNovelModalProps) {
  const [formData, setFormData] = useState<CreateNovelRequest>({
    title: '',
    author: '',
    description: '',
    cover_image: '',
    category_id: 0,
    status: 'draft',
    word_count_level: 'short',
    is_vip: false,
    is_recommended: false,
    is_active: true,
    tag_ids: [],
  });

  const [categories, setCategories] = useState<NovelCategory[]>([]);
  const [tags, setTags] = useState<NovelTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        setError('加载数据失败');
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('请输入小说标题');
      return;
    }

    if (!formData.category_id) {
      setError('请选择小说分类');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const novelData: CreateNovelRequest = {
        ...formData,
        tag_ids: selectedTags,
      };

      const newNovel = await createNovel(novelData);
      onSuccess(newNovel);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建小说失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
              创建新小说
            </h2>
            <button
              onClick={onClose}
              className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  小说标题 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                  placeholder="请输入小说标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  作者名称
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                  placeholder="留空则使用当前用户名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  小说简介
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                  placeholder="请输入小说简介"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  封面图片URL
                </label>
                <input
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                  placeholder="请输入封面图片URL"
                />
              </div>
            </div>

            {/* 分类和设置 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  小说分类 *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                >
                  <option value={0}>请选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  连载状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as CreateNovelRequest['status'] }))}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                >
                  <option value="draft">草稿</option>
                  <option value="serializing">连载中</option>
                  <option value="completed">已完结</option>
                  <option value="paused">暂停</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  字数等级
                </label>
                <select
                  value={formData.word_count_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, word_count_level: e.target.value as CreateNovelRequest['word_count_level'] }))}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                >
                  <option value="short">短篇</option>
                  <option value="medium">中篇</option>
                  <option value="long">长篇</option>
                  <option value="super_long">超长篇</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_vip}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_vip: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-light-text dark:text-dark-text">VIP小说</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-light-text dark:text-dark-text">启用</span>
                </label>
              </div>
            </div>

            {/* 标签选择 */}
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                小说标签
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`
                      px-3 py-1 rounded-full text-sm transition-colors
                      ${selectedTags.includes(tag.id)
                        ? 'bg-wood-primary text-white'
                        : 'bg-light-hover dark:bg-dark-hover text-light-text dark:text-dark-text hover:bg-wood-primary/20'
                      }
                    `}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-wood-primary text-white rounded-lg hover:bg-wood-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '创建中...' : '创建小说'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
