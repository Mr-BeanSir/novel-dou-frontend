'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useIsAuthenticated, useIsLoading } from '@/stores/userSimple';
import { Novel } from '@/types/novel';
import { getUserNovelDetail, getChapterContent } from '@/services/user-novel';
import { ManageLayout } from '@/components/manage/ManageLayout';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { ArrowLeft, Edit, Eye, Calendar, FileText } from 'lucide-react';

interface ChapterContent {
  id: number;
  title: string;
  chapter_number: number;
  word_count: number;
  is_vip: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ChapterContentResponse {
  chapter: ChapterContent;
  content: string;
}

export default function ManageChapterViewPage() {
  const params = useParams();
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isAuthLoading = useIsLoading();
  const user = useUser();

  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapter, setChapter] = useState<ChapterContent | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const novelId = params.novelId as string;
  const chapterId = params.chapterId as string;

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

    // 只有在认证通过且有参数时才加载数据
    if (isHydrated && !isAuthLoading && isAuthenticated && novelId && chapterId) {
      loadData();
    }
  }, [novelId, chapterId, isAuthenticated, isAuthLoading, router, isHydrated]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [novelData, chapterData] = await Promise.all([
        getUserNovelDetail(parseInt(novelId)),
        getChapterContent(parseInt(novelId), parseInt(chapterId))
      ]);

      // 检查是否是用户自己的小说
      if (novelData.author !== user?.name) {
        setError('您没有权限查看此章节');
        return;
      }

      setNovel(novelData);
      setChapter(chapterData.chapter);
      setContent(chapterData.content || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取章节内容失败');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = (content: string) => {
    // 简单的markdown渲染
    if (!content || typeof content !== 'string') {
      return '';
    }

    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 text-light-text dark:text-dark-text">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2 text-light-text dark:text-dark-text">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic mb-4">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^---$/gm, '<hr class="my-4 border-gray-300">')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
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
      <ManageLayout novelTitle={novel?.title} novelId={novelId}>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </ManageLayout>
    );
  }

  if (error) {
    return (
      <ManageLayout novelTitle={novel?.title} novelId={novelId}>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
            加载失败
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push(`/manage/${novelId}?tab=chapters`)}
            className="px-6 py-3 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors font-medium"
          >
            返回章节管理
          </button>
        </div>
      </ManageLayout>
    );
  }

  if (!novel || !chapter) {
    return (
      <ManageLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-light-text dark:text-dark-text mb-2">
            章节不存在
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            请检查章节ID是否正确
          </p>
          <button
            onClick={() => router.push(`/manage/${novelId}?tab=chapters`)}
            className="px-6 py-3 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors font-medium"
          >
            返回章节管理
          </button>
        </div>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout novelTitle={novel.title} novelId={novelId}>
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
              第 {chapter.chapter_number} 章
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/novel/${novelId}/chapter/${chapterId}`)}
              className="flex items-center gap-2 px-4 py-2 border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <Eye className="w-4 h-4" />
              预览
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              编辑
            </button>
          </div>
        </div>

        {/* 章节信息 */}
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-2">
                {chapter.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {chapter.word_count.toLocaleString()} 字
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(chapter.created_at)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {chapter.is_vip && (
                <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
                  VIP
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                chapter.is_active
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {chapter.is_active ? '已发布' : '草稿'}
              </span>
            </div>
          </div>

          {/* 章节内容 */}
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary">
            <div
                className="prose prose-lg max-w-none text-light-text dark:text-dark-text leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: `<p class="mb-4">${renderContent(content)}</p>`
                }}
            />
          </div>
        </div>
      </div>
    </ManageLayout>
  );
}
