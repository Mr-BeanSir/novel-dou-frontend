'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Novel page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            加载出错了
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            抱歉，加载小说详情时出现了错误。
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left text-sm text-red-600 dark:text-red-400 mb-4">
              <summary className="cursor-pointer">错误详情</summary>
              <pre className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block px-6 py-3 bg-light-accent hover:bg-light-accent-hover 
                     dark:bg-dark-accent dark:hover:bg-dark-accent-hover 
                     text-white rounded-lg transition-colors"
          >
            重试
          </button>
          
          <div>
            <Link
              href="/"
              className="text-light-accent dark:text-dark-accent hover:underline"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
