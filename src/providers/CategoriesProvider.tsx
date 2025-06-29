'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCategories } from '@/services/novel';
import { mockCategories } from '@/data/mock-data';
import { cache } from '@/lib/cache';
import type { NovelCategory } from '@/types/novel';

interface CategoriesContextType {
  categories: NovelCategory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<NovelCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const categoriesData = await cache.getOrFetch(
        'categories',
        async () => {
          try {
            return await getCategories();
          } catch (err) {
            console.warn('获取分类失败，使用模拟数据:', err);
            return mockCategories;
          }
        },
        10 * 60 * 1000 // 10分钟缓存
      );

      setCategories(categoriesData);
    } catch (err) {
      console.error('获取分类数据失败:', err);
      setCategories(mockCategories);
      setError(err instanceof Error ? err.message : '获取分类失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const value = {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}
