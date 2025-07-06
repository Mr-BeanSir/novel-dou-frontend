'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/types/user';
import {
  BookOpen,
  Users,
  Tags,
  FolderOpen,
  BarChart3,
  Settings,
  Home,
  Shield
} from 'lucide-react';

interface AdminNavigationProps {
  user: User;
  children: React.ReactNode;
}

export function AdminNavigation({ user, children }: AdminNavigationProps) {
  const pathname = usePathname();

  const tabs = [
    { id: 'overview', label: '概览', icon: BarChart3, href: '/admin' },
    { id: 'novels', label: '小说管理', icon: BookOpen, href: '/admin/novels' },
    { id: 'users', label: '用户管理', icon: Users, href: '/admin/users' },
    { id: 'categories', label: '分类管理', icon: FolderOpen, href: '/admin/categories' },
    { id: 'tags', label: '标签管理', icon: Tags, href: '/admin/tags' },
    { id: 'settings', label: '系统设置', icon: Settings, href: '/admin/settings' },
  ] as const;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* 顶部导航 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>返回首页</span>
              </Link>
              <span className="text-light-text-secondary dark:text-dark-text-secondary">/</span>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-light-accent dark:text-dark-accent" />
                <span className="text-light-text dark:text-dark-text font-medium">
                  管理员控制台
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-light-text dark:text-dark-text font-medium">
                  {user.name}
                </p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {user.user_group?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 侧边栏 */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  管理功能
                </h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.href;
                    return (
                      <Link
                        key={tab.id}
                        href={tab.href}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-light-accent dark:bg-dark-accent text-white'
                            : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* 主内容区 */}
          {children}
        </div>
      </div>
    </div>
  );
}
