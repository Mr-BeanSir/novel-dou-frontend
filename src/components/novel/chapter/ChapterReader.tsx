'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Eye, Calendar } from 'lucide-react';
import type { Novel, NovelChapter } from '@/types/novel';

interface ChapterReaderProps {
  novel: Novel;
  chapter: NovelChapter;
}

export default function ChapterReader({ novel, chapter }: ChapterReaderProps) {
  const router = useRouter();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取章节内容
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/novels/${novel.id}/chapters/${chapter.id}`);
        if (!response.ok) {
          throw new Error('获取章节内容失败');
        }

        const data = await response.json();
        setContent(data.content || '章节内容暂未提供');
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载章节内容失败');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [novel.id, chapter.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-light-border dark:border-dark-border border-t-light-accent dark:border-t-dark-accent mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">加载章节内容中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">加载失败</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-light-accent dark:bg-dark-accent text-light-bg dark:text-dark-bg rounded-lg hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* 顶部导航 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/novel/${novel.id}`}
              className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回小说详情
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
                title="上一章"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.forward()}
                className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
                title="下一章"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 章节内容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 章节标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-4">
            {chapter.title}
          </h1>
          
          {/* 章节信息 */}
          <div className="flex items-center justify-center space-x-6 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {chapter.word_count_formatted}
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {chapter.view_count} 阅读
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(chapter.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* 章节正文 */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-light-text dark:text-dark-text leading-relaxed whitespace-pre-wrap"
            style={{ 
              fontFamily: '黑体, SimHei, sans-serif',
              lineHeight: '1.6',
              fontSize: '18px'
            }}
          >
            {content}
          </div>
        </div>

        {/* 底部导航 */}
        <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center px-6 py-3 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text rounded-lg hover:bg-light-border dark:hover:bg-dark-border transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              上一章
            </button>
            
            <Link
              href={`/novel/${novel.id}`}
              className="px-6 py-3 bg-light-accent dark:bg-dark-accent text-light-bg dark:text-dark-bg rounded-lg hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover transition-colors"
            >
              目录
            </Link>
            
            <button
              onClick={() => router.forward()}
              className="flex items-center px-6 py-3 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text rounded-lg hover:bg-light-border dark:hover:bg-dark-border transition-colors"
            >
              下一章
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
