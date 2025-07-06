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

  // 在客户端挂载后，强制重新渲染以确保主题正确应用
  useEffect(() => {
    if (mounted && themeHook.resolvedTheme) {
      // 强制触发一次主题应用
      const event = new CustomEvent('themeChange', {
        detail: { theme: themeHook.resolvedTheme }
      });
      window.dispatchEvent(event);
    }
  }, [mounted, themeHook.resolvedTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
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
