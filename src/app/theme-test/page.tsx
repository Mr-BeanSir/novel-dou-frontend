'use client';

import { useThemeContext } from '@/providers/ThemeProvider';
import { useState, useEffect } from 'react';

export default function ThemeTestPage() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen p-8 bg-light-bg text-light-text">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            主题测试页面 (加载中...)
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-light-bg text-light-text">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          主题测试页面
        </h1>

        {/* 主题信息 */}
        <div className="mb-8 p-6 bg-light-bg-secondary rounded-lg border border-light-border">
          <h2 className="text-xl font-semibold mb-4 text-light-text">
            当前主题信息
          </h2>
          <p className="text-light-text-secondary">
            设置主题: {theme}
          </p>
          <p className="text-light-text-secondary">
            实际主题: {resolvedTheme}
          </p>
          <p className="text-light-text-secondary">
            HTML 类: {typeof window !== 'undefined' ? document.documentElement.className : 'N/A'}
          </p>
          <p className="text-light-text-secondary">
            Body 类: {typeof window !== 'undefined' ? document.body.className : 'N/A'}
          </p>
        </div>

        {/* 主题切换按钮 */}
        <div className="mb-8 p-6 bg-light-bg-secondary rounded-lg border border-light-border">
          <h2 className="text-xl font-semibold mb-4 text-light-text">
            主题切换
          </h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-md border transition-colors ${
                theme === 'light'
                  ? 'bg-light-accent text-white border-light-accent'
                  : 'bg-light-bg text-light-text border-light-border hover:bg-light-hover'
              }`}
            >
              亮色模式
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-md border transition-colors ${
                theme === 'dark'
                  ? 'bg-light-accent text-white border-light-accent'
                  : 'bg-light-bg text-light-text border-light-border hover:bg-light-hover'
              }`}
            >
              暗色模式
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded-md border transition-colors ${
                theme === 'system'
                  ? 'bg-light-accent text-white border-light-accent'
                  : 'bg-light-bg text-light-text border-light-border hover:bg-light-hover'
              }`}
            >
              跟随系统
            </button>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-md border bg-light-accent text-white border-light-accent hover:bg-light-accent-hover transition-colors"
            >
              快速切换
            </button>
          </div>
        </div>

        {/* 样式测试 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-light-bg-secondary rounded-lg border border-light-border">
            <h3 className="text-lg font-semibold mb-3 text-light-text">
              文本样式测试
            </h3>
            <p className="text-light-text mb-2">
              主要文本颜色 (当前: {resolvedTheme})
            </p>
            <p className="text-light-text-secondary mb-2">
              次要文本颜色
            </p>
            <p className="text-light-accent">
              强调色文本
            </p>
          </div>

          <div className="p-6 bg-light-bg-secondary rounded-lg border border-light-border">
            <h3 className="text-lg font-semibold mb-3 text-light-text">
              按钮样式测试
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-light-accent text-white rounded-md hover:bg-light-accent-hover transition-colors">
                主要按钮
              </button>
              <button className="w-full px-4 py-2 border border-light-border text-light-text rounded-md hover:bg-light-hover transition-colors">
                次要按钮
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
