'use client';

import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 防止 SSR 水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    console.log('Theme toggle clicked, current theme:', resolvedTheme);
    toggleTheme();
  };

  // 在客户端挂载前显示默认样式
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md border border-light-border bg-light-bg-secondary text-light-text transition-colors duration-200"
        aria-label="切换主题"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-md border border-light-border bg-light-bg-secondary text-light-text transition-colors duration-200"
      aria-label="切换主题"
      title={`当前: ${resolvedTheme === 'light' ? '亮色' : '暗色'}模式`}
    >
      {resolvedTheme === 'light' ? (
        // 月亮图标 (切换到暗色模式)
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // 太阳图标 (切换到亮色模式)
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}
