'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useIsAuthenticated, useClearAuth } from '@/stores/userSimple';
import { AuthService, isAdmin } from '@/services/auth';
import ThemeToggle from './ThemeToggle';
import { Shield } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const clearAuth = useClearAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 导航项配置
  const navigationItems = [
    { name: '首页', href: '/' },
    { name: '分类', href: '/categories' },
    { name: '作者', href: '/authors' },
    { name: '标签', href: '/tags' },
    { name: '排行榜', href: '/rankings' },
  ];

  const handleLogout = async () => {
    try {
      // 首先验证localStorage中的user-storage数据
      let shouldCallAPI = true;

      if (typeof window !== 'undefined') {
        try {
          const userStorage = localStorage.getItem('user-storage');
          if (!userStorage) {
            console.log('Logout: No user-storage found in localStorage');
            shouldCallAPI = false;
          } else {
            const parsed = JSON.parse(userStorage);
            if (!parsed.state?.token || !parsed.state?.isAuthenticated) {
              console.log('Logout: Invalid user-storage data - missing token or authentication status', {
                hasToken: !!parsed.state?.token,
                isAuthenticated: !!parsed.state?.isAuthenticated
              });
              shouldCallAPI = false;
            }
          }
        } catch (parseError) {
          console.error('Logout: Failed to parse user-storage data', parseError);
          shouldCallAPI = false;
        }
      }

      // 如果数据有效，调用后端退出登录API
      if (shouldCallAPI) {
        try {
          await AuthService.logout();
          console.log('Logout: Successfully called backend logout API');
        } catch (apiError) {
          console.error('Logout: Backend API call failed', apiError);
          // API调用失败不影响本地清理
        }
      } else {
        console.log('Logout: Skipping API call due to invalid local storage data');
      }

      // 清空本地状态
      clearAuth();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-storage');
      }

      // 重定向到登录页面
      router.push('/login');
    } catch (error) {
      console.error('Logout: Unexpected error during logout process', error);

      // 发生任何错误都要清空本地状态并重定向
      clearAuth();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-storage');
      }
      router.push('/login');
    } finally {
      setIsUserMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-light-bg/95 dark:bg-dark-bg/95
                         backdrop-blur-sm border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-light-accent dark:bg-dark-accent rounded-md
                              flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-light-bg dark:text-dark-bg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-light-text dark:text-dark-text">
                  读书豆
                </span>
              </Link>
            </div>

            {/* 主导航 */}
            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-light-text dark:text-dark-text
                             hover:text-light-accent dark:hover:text-dark-accent
                             hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                             rounded-md transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-light-text dark:text-dark-text
                         hover:text-light-accent dark:hover:text-dark-accent
                         hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                         transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-4">
              {/* 主题切换 */}
              <ThemeToggle />

              {/* 用户区域 */}
              {isAuthenticated && user && (
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
              )}
            </div>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-light-border dark:border-dark-border">
            <nav className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-light-text dark:text-dark-text
                           hover:text-light-accent dark:hover:text-dark-accent
                           hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                           rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
