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
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'novels' && <NovelsTab />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'categories' && <CategoriesTab />}
                {activeTab === 'tags' && <TagsTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 概览标签页
function OverviewTab() {
  return (
    <div>
      <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">
        系统概览
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 统计卡片 */}
        <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">总小说数</p>
              <p className="text-2xl font-bold text-light-text dark:text-dark-text">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">总用户数</p>
              <p className="text-2xl font-bold text-light-text dark:text-dark-text">5,678</p>
            </div>
          </div>
        </div>

        <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">分类数</p>
              <p className="text-2xl font-bold text-light-text dark:text-dark-text">24</p>
            </div>
          </div>
        </div>

        <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Tags className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">标签数</p>
              <p className="text-2xl font-bold text-light-text dark:text-dark-text">156</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          管理员功能正在开发中，敬请期待...
        </p>
      </div>
    </div>
  );
}

// 其他标签页的占位组件
function NovelsTab() {
  return (
    <div>
      <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">
        小说管理
      </h3>
      <div className="text-center py-8">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          小说管理功能正在开发中...
        </p>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div>
      <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">
        用户管理
      </h3>
      <div className="text-center py-8">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          用户管理功能正在开发中...
        </p>
      </div>
    </div>
  );
}

function CategoriesTab() {
  return (
    <div>
      <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">
        分类管理
      </h3>
      <div className="text-center py-8">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          分类管理功能正在开发中...
        </p>
      </div>
    </div>
  );
}

function TagsTab() {
  return (
    <div>
      <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">
        标签管理
      </h3>
      <div className="text-center py-8">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          标签管理功能正在开发中...
        </p>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">
        系统设置
      </h3>
      <div className="text-center py-8">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          系统设置功能正在开发中...
        </p>
      </div>
    </div>
  );
}
