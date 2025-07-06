// 服务端Header组件

import Link from 'next/link';
import { getServerUser } from '@/lib/auth-server';
import ClientHeader from './ClientHeader';
import ThemeToggle from './ThemeToggle';
import HeaderSearch from './HeaderSearch';
import { Shield } from 'lucide-react';

export default async function ServerHeader() {
  const user = await getServerUser();

  // 导航项配置
  const navigationItems = [
    { name: '首页', href: '/' },
    { name: '分类', href: '/categories' },
    // { name: '作者', href: '/authors' },
    { name: '标签', href: '/tags' },
    { name: '排行榜', href: '/rankings' },
  ];

  return (
    <header className="bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-light-accent dark:bg-dark-accent rounded-lg flex items-center justify-center">
                <span className="text-light-bg dark:text-dark-bg font-bold text-lg">读</span>
              </div>
              <span className="text-xl font-bold text-light-text dark:text-dark-text">
                读书豆
              </span>
            </Link>
          </div>

          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent
                         transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 右侧区域 */}
          <div className="flex items-center space-x-4">
            {/* 搜索框 */}
            <HeaderSearch />

            {/* 主题切换 */}
            <ThemeToggle />

            {/* 用户区域或登录按钮 */}
            {user ? (
              <ClientHeader user={user} />
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-light-text dark:text-dark-text
                           hover:text-light-accent dark:hover:text-dark-accent
                           transition-colors duration-200"
                >
                  登录
                </Link>
                <Link
                  href="/login?mode=register"
                  className="px-4 py-2 bg-light-accent dark:bg-dark-accent
                           text-light-bg dark:text-dark-bg rounded-md
                           hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover
                           transition-colors duration-200 font-medium"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
