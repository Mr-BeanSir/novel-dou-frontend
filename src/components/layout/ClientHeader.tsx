'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthService, isAdmin } from '@/services/auth';
import { Shield } from 'lucide-react';
import type { User } from '@/types/user';

interface ClientHeaderProps {
  user: User;
}

export default function ClientHeader({ user }: ClientHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // 调用新的登出API
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // 即使API调用失败，也要重定向到登录页面
      window.location.href = '/login';
    } finally {
      setIsUserMenuOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-2 p-2 rounded-md
                 text-light-text dark:text-dark-text
                 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-light-accent dark:bg-dark-accent
                      rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-light-bg dark:text-dark-bg">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block">{user.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isUserMenuOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 用户菜单 */}
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48
                      bg-light-bg dark:bg-dark-bg
                      border border-light-border dark:border-dark-border
                      rounded-md shadow-lg py-1 z-50">
          {/* 个人功能区 */}
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-light-text dark:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
            onClick={() => setIsUserMenuOpen(false)}
          >
            个人中心
          </Link>
          <Link
            href="/profile?tab=bookmarks"
            className="block px-4 py-2 text-sm text-light-text dark:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
            onClick={() => setIsUserMenuOpen(false)}
          >
            我的收藏
          </Link>
          <Link
            href="/profile?tab=history"
            className="block px-4 py-2 text-sm text-light-text dark:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
            onClick={() => setIsUserMenuOpen(false)}
          >
            阅读历史
          </Link>
          <Link
            href="/profile?tab=statistics"
            className="block px-4 py-2 text-sm text-light-text dark:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
            onClick={() => setIsUserMenuOpen(false)}
          >
            阅读统计
          </Link>

          {/* 管理员入口 */}
          {isAdmin(user) && (
            <>
              <div className="border-t border-light-border dark:border-dark-border my-1"></div>
              <Link
                href="/admin"
                className="flex items-center px-4 py-2 text-sm text-light-text dark:text-dark-text
                         hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <Shield className="w-4 h-4 mr-2 text-light-accent dark:text-dark-accent" />
                管理员控制台
              </Link>
            </>
          )}

          <hr className="my-1 border-light-border dark:border-dark-border" />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
}
