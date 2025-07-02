'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useIsAuthenticated, useIsLoading } from '@/stores/user';
import { Novel } from '@/types/novel';
import { getUserNovelDetail } from '@/services/user-novel';
import { publishChapter } from '@/services/user-novel';
import { ManageLayout } from '@/components/manage/ManageLayout';
import { MarkdownEditor } from '@/components/manage/MarkdownEditor';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { Save, Send, ArrowLeft, FileText } from 'lucide-react';

export default function PublishChapterPage() {
  const params = useParams();
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isAuthLoading = useIsLoading();
  const user = useUser();

  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_vip: false,
    is_active: true,
    chapter_number: 0
  });

  const novelId = params.novelId as string;

  // 等待客户端 hydration 完成
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // 只有在 hydration 完成且不在加载状态时才检查认证
    if (isHydrated && !isAuthLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // 只有在认证通过且有 novelId 时才加载小说数据
    if (isHydrated && !isAuthLoading && isAuthenticated && novelId) {
      loadNovel();
    }
  }, [novelId, isAuthenticated, isAuthLoading, router, isHydrated]);

  const loadNovel = async () => {
    try {
      setLoading(true);
      setError(null);

      const novelData = await getUserNovelDetail(parseInt(novelId));

      // 检查是否是用户自己的小说
      if (novelData.author !== user?.name) {
        setError('您没有权限为此小说发布章节');
        return;
      }

      setNovel(novelData);

      // 设置默认章节号
      setFormData(prev => ({
        ...prev,
        chapter_number: novelData.chapter_count + 1
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取小说信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = async () => {
    try {
      setPublishing(true);
      setError(null);
      setSuccess(null);

      if (!formData.title.trim()) {
        setError('请输入章节标题');
        return;
      }

      if (!formData.content.trim()) {
        setError('请输入章节内容');
        return;
      }

      const draftData = {
        title: formData.title,
        content: formData.content,
        chapter_number: formData.chapter_number,
        is_vip: formData.is_vip,
        is_active: false // 草稿状态
      };

      await publishChapter(parseInt(novelId), draftData);

      setSuccess('草稿保存成功');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存草稿失败');
    } finally {
      setPublishing(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError(null);
      setSuccess(null);

      if (!formData.title.trim()) {
        setError('请输入章节标题');
        return;
      }

      if (!formData.content.trim()) {
        setError('请输入章节内容');
        return;
      }

      const publishData = {
        title: formData.title,
        content: formData.content,
        chapter_number: formData.chapter_number,
        is_vip: formData.is_vip,
        is_active: formData.is_active
      };

      await publishChapter(parseInt(novelId), publishData);

      setSuccess('章节发布成功');

      // 发布成功后跳转回管理页面
      setTimeout(() => {
        router.push(`/manage/${novelId}?tab=chapters`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发布章节失败');
    } finally {
      setPublishing(false);
    }
  };

  const getWordCount = (text: string) => {
    return text.replace(/[#*_`~\[\]()]/g, '').replace(/\s+/g, ' ').trim().length;
  };

  // 显示加载状态：正在加载认证状态或者还未 hydration
  if (isAuthLoading || !isHydrated) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 如果未认证，不渲染任何内容（会被重定向）
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <ManageLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </ManageLayout>
    );
  }

  if (error && !novel) {
    return (
      <ManageLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
            加载失败
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="px-6 py-3 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors font-medium"
          >
            返回个人中心
          </button>
        </div>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout novelTitle={novel?.title} novelId={novelId}>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/manage/${novelId}?tab=chapters`)}
              className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              返回章节管理
            </button>
            <div className="w-px h-6 bg-light-border dark:border-dark-border"></div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text flex items-center gap-2">
              <FileText className="w-6 h-6" />
              发布新章节
            </h1>
          </div>
        </div>

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

        {/* 章节信息表单 */}
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-6">章节信息</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                章节标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                placeholder="请输入章节标题"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                章节序号
              </label>
              <input
                type="number"
                value={formData.chapter_number}
                onChange={(e) => handleInputChange('chapter_number', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                min="1"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_vip"
                checked={formData.is_vip}
                onChange={(e) => handleInputChange('is_vip', e.target.checked)}
                className="w-4 h-4 text-light-accent focus:ring-light-accent border-light-border rounded"
              />
              <label htmlFor="is_vip" className="text-sm font-medium text-light-text dark:text-dark-text">
                VIP章节
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="w-4 h-4 text-light-accent focus:ring-light-accent border-light-border rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-light-text dark:text-dark-text">
                立即发布（取消勾选将保存为草稿）
              </label>
            </div>
          </div>
        </div>

        {/* 章节内容编辑器 */}
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-light-text dark:text-dark-text">章节内容</h3>
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              字数：{getWordCount(formData.content)}
            </div>
          </div>

          <MarkdownEditor
            value={formData.content}
            onChange={(content) => handleInputChange('content', content)}
            placeholder="开始写作您的章节内容..."
            height="600px"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSaveDraft}
            disabled={publishing}
            className="flex items-center gap-2 px-6 py-2 border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {publishing ? '保存中...' : '保存草稿'}
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing || !formData.title.trim() || !formData.content.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            <Send className="w-4 h-4" />
            {publishing ? '发布中...' : '发布章节'}
          </button>
        </div>
      </div>
    </ManageLayout>
  );
}
