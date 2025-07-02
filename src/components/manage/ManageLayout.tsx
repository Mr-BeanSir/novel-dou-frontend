'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ManageLayoutProps {
  children: ReactNode;
  novelTitle?: string;
  novelId?: string;
}

export function ManageLayout({ children, novelTitle, novelId }: ManageLayoutProps) {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* 顶部导航 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回个人中心</span>
            </Link>
            
            {novelTitle && (
              <>
                <span className="text-light-text-secondary dark:text-dark-text-secondary">/</span>
                <h1 className="text-xl font-bold text-light-text dark:text-dark-text">
                  管理《{novelTitle}》
                </h1>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
