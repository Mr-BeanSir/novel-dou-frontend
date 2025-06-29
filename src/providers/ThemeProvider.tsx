'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const themeHook = useTheme();

  // 防止服务端渲染时的主题闪烁
  useEffect(() => {
    setMounted(true);
  }, []);

  // 为 SSR 创建默认的 context 值
  const defaultContextValue: ThemeContextType = {
    theme: defaultTheme,
    resolvedTheme: 'light', // SSR 时默认使用 light 主题
    setTheme: () => {}, // SSR 时的空函数
    toggleTheme: () => {}, // SSR 时的空函数
  };

  const contextValue = mounted ? themeHook : defaultContextValue;
  const themeClass = mounted ? themeHook.resolvedTheme : 'light';

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={themeClass}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
