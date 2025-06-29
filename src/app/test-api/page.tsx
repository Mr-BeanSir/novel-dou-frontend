'use client';

import { useState } from 'react';
import { NovelService } from '@/services/novel';

export default function TestApiPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setResult('正在测试API连接...\n');

    try {
      // 测试基础连接
      setResult(prev => prev + '测试API基础连接...\n');
      setResult(prev => prev + `API地址: ${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}\n\n`);

      // 测试获取分类
      setResult(prev => prev + '1. 测试获取分类 (GET /api/novels/categories/all)...\n');
      const categories = await NovelService.getCategories();
      setResult(prev => prev + `✅ 分类获取成功，共 ${categories.length} 个分类\n\n`);

      // 测试获取小说列表
      setResult(prev => prev + '2. 测试获取小说列表 (GET /api/novels)...\n');
      const novels = await NovelService.getNovels({ page: 1, per_page: 5 });
      setResult(prev => prev + `✅ 小说列表获取成功，共 ${novels.total} 本小说，当前页 ${novels.data.length} 本\n\n`);

      // 如果有小说，测试获取第一本小说的详情
      if (novels.data.length > 0) {
        const firstNovel = novels.data[0];
        setResult(prev => prev + `3. 测试获取小说详情 (GET /api/novels/${firstNovel.id})...\n`);
        const novelDetail = await NovelService.getNovel(firstNovel.id);
        setResult(prev => prev + `✅ 小说详情获取成功: ${novelDetail.title}\n`);
        setResult(prev => prev + `   作者: ${novelDetail.author}\n`);
        setResult(prev => prev + `   状态: ${novelDetail.status_text}\n`);
        setResult(prev => prev + `   章节数: ${novelDetail.chapter_count}\n\n`);

        // 测试获取章节列表
        if (novelDetail.chapter_count > 0) {
          setResult(prev => prev + `4. 测试获取章节列表 (GET /api/novels/${novelDetail.id}/chapters)...\n`);
          const chapters = await NovelService.getNovelChapters(novelDetail.id, 1, 5);
          setResult(prev => prev + `✅ 章节列表获取成功，共 ${chapters.total} 章，当前页 ${chapters.data.length} 章\n\n`);
        }

        // 测试获取评论列表
        setResult(prev => prev + `5. 测试获取评论列表 (GET /api/novels/${novelDetail.id}/comments)...\n`);
        const comments = await NovelService.getComments(novelDetail.id, 1, 5);
        setResult(prev => prev + `✅ 评论列表获取成功，共 ${comments.total} 条评论，当前页 ${comments.data.length} 条\n\n`);
      }

      setResult(prev => prev + '🎉 所有API测试通过！\n');
      setResult(prev => prev + '现在可以正常使用小说详情页功能了。\n');
    } catch (error) {
      console.error('API测试失败:', error);
      setResult(prev => prev + `❌ API测试失败: ${error instanceof Error ? error.message : '未知错误'}\n`);
      setResult(prev => prev + '\n请检查:\n');
      setResult(prev => prev + '1. 后端服务是否在 localhost:8000 运行\n');
      setResult(prev => prev + '2. API端点是否正确\n');
      setResult(prev => prev + '3. 数据库是否有数据\n');
    } finally {
      setLoading(false);
    }
  };

  const testSpecificNovel = async () => {
    const novelId = prompt('请输入要测试的小说ID:');
    if (!novelId) return;

    setLoading(true);
    setResult(`正在测试小说ID: ${novelId}...\n`);

    try {
      const novel = await NovelService.getNovel(parseInt(novelId));
      setResult(prev => prev + `✅ 小说详情获取成功:\n`);
      setResult(prev => prev + `标题: ${novel.title}\n`);
      setResult(prev => prev + `作者: ${novel.author}\n`);
      setResult(prev => prev + `状态: ${novel.status_text}\n`);
      setResult(prev => prev + `章节数: ${novel.chapter_count}\n`);
    } catch (error) {
      setResult(prev => prev + `❌ 获取小说详情失败: ${error instanceof Error ? error.message : '未知错误'}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-8">
          API 连接测试
        </h1>

        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                        border border-light-border dark:border-dark-border
                        rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
            当前API配置
          </h2>
          <div className="text-light-text-secondary dark:text-dark-text-secondary">
            <p><strong>API地址:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}</p>
            <p><strong>前端地址:</strong> {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={testApiConnection}
            disabled={loading}
            className="px-6 py-3 bg-light-accent hover:bg-light-accent-hover
                     dark:bg-dark-accent dark:hover:bg-dark-accent-hover
                     text-white rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '测试中...' : '测试API连接'}
          </button>

          <button
            onClick={testSpecificNovel}
            disabled={loading}
            className="ml-4 px-6 py-3 bg-transparent border-2 border-light-accent dark:border-dark-accent
                     text-light-accent dark:text-dark-accent
                     hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent dark:hover:text-white
                     rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            测试指定小说
          </button>
        </div>

        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                        border border-light-border dark:border-dark-border
                        rounded-lg p-6">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
            测试结果
          </h3>
          <pre className="text-sm text-light-text-secondary dark:text-dark-text-secondary
                         whitespace-pre-wrap font-mono bg-light-bg dark:bg-dark-bg
                         p-4 rounded border border-light-border dark:border-dark-border
                         max-h-96 overflow-y-auto">
            {result || '点击上方按钮开始测试...'}
          </pre>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-light-accent dark:text-dark-accent hover:underline"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
