'use client';

import { useState } from 'react';
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
import { SystemOverview } from './SystemOverview';
import { NovelManagement } from './NovelManagement';
import { UserManagement } from './UserManagement';
import { CategoryManagement } from './CategoryManagement';
import { TagManagement } from './TagManagement';
import { SystemSettings } from './SystemSettings';

interface AdminDashboardProps {
  user: User;
}

type TabType = 'overview' | 'novels' | 'users' | 'categories' | 'tags' | 'settings';

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', label: '概览', icon: BarChart3 },
    { id: 'novels', label: '小说管理', icon: BookOpen },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'categories', label: '分类管理', icon: FolderOpen },
    { id: 'tags', label: '标签管理', icon: Tags },
    { id: 'settings', label: '系统设置', icon: Settings },
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
                <h1 className="text-xl font-bold text-light-text dark:text-dark-text">
                  管理员控制台
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                欢迎，{user.name}
              </span>
              <div className="w-8 h-8 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
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
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-light-accent dark:bg-dark-accent text-white'
                            : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="flex-1">
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
              <div className="p-6">
                {activeTab === 'overview' && <SystemOverview />}
                {activeTab === 'novels' && <NovelManagement />}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'categories' && <CategoryManagement />}
                {activeTab === 'tags' && <TagManagement />}
                {activeTab === 'settings' && <SystemSettings />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


