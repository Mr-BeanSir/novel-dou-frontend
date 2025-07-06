'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface ManageLayoutProps {
  children: ReactNode;
  novelTitle?: string;
  novelId?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function ManageLayout({ children, novelTitle, novelId, breadcrumbs }: ManageLayoutProps) {
  // 构建默认面包屑
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: '个人中心', href: '/profile' },
    { label: '小说管理', href: novelId ? `/manage/${novelId}` : undefined },
  ];

  if (novelTitle) {
    defaultBreadcrumbs.push({ label: novelTitle });
  }

  // 使用传入的面包屑或默认面包屑
  const finalBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* 顶部导航 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {finalBreadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                {index > 0 && (
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">/</span>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 font-bold text-light-text-secondary dark:text-dark-text-secondary hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                  >
                    {index === 0 && <ArrowLeft className="w-5 h-5" />}
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-light-text-secondary/60 dark:text-dark-text-secondary/60">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
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
