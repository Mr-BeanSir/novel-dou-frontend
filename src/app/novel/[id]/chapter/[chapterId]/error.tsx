'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface ChapterErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChapterError({ error, reset }: ChapterErrorProps) {
  useEffect(() => {
    console.error('Chapter error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            章节加载失败
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            抱歉，无法加载该章节内容。请检查网络连接或稍后重试。
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center px-4 py-3 
                     bg-[#c49e65] hover:bg-[#a9744f] 
                     text-white rounded-md transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            重新加载
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center px-4 py-3 
                     border border-light-border dark:border-dark-border
                     text-light-text dark:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                     rounded-md transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回首页
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-light-text-secondary dark:text-dark-text-secondary">
              错误详情 (开发模式)
            </summary>
            <pre className="mt-2 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary 
                          text-xs text-light-text dark:text-dark-text 
                          rounded border overflow-auto">
              {error.message}
              {error.stack && '\n\n' + error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
