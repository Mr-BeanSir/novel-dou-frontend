'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCategoriesPaginated } from '@/services/novel';
import { Pagination } from '@/components/ui/Pagination';
import { useUserStore } from '@/stores/user';
import type { NovelCategory, CategoryListParams, PaginatedResponse } from '@/types/novel';

// 分类卡片组件
function CategoryCard({ category }: { category: NovelCategory }) {
  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  // 格式化更新时间
  const formatUpdateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '今天';
    } else if (diffDays <= 7) {
      return `${diffDays}天前`;
    } else if (diffDays <= 30) {
      return `${Math.ceil(diffDays / 7)}周前`;
    } else {
      return `${Math.ceil(diffDays / 30)}个月前`;
    }
  };

  // 判断分类是否活跃（30天内有更新）
  const isActive = (() => {
    const lastUpdate = new Date(category.updated_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastUpdate >= thirtyDaysAgo;
  })();

  return (
    <div className="group">
      <Link href={`/novels?category_id=${category.id}`}>
        <div className="border border-light-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-light-accent/10
                        transition-all duration-300 hover:scale-[1.03]
                        group cursor-pointer">
          {/* 封面区域 */}
          <div className="relative aspect-[4/3] overflow-hidden bg-cover-bg">
            <div className="w-full h-full bg-gradient-to-br from-light-border to-light-bg-secondary
                          flex items-center justify-center relative overflow-hidden">
              {/* 背景装饰 */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 border-2 border-light-accent rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-light-accent rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-light-accent rounded-full"></div>
              </div>

              {/* 分类图标 */}
              <div className="relative z-10 text-4xl text-light-accent">
                📚
              </div>

              {/* 活跃状态标识 */}
              {isActive && (
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  活跃
                </div>
              )}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-5 bg-light-bg-secondary">
            {/* 分类名称 */}
            <h3 className="font-bold text-xl text-light-text mb-3
                         group-hover:text-light-accent transition-colors duration-200 leading-tight">
              {category.name}
            </h3>

            {/* 统计信息 */}
            <div className="space-y-2 text-sm text-light-text-secondary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{formatNumber(category.novel_count)} 部作品</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>更新于 {formatUpdateTime(category.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function CategoriesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useUserStore();

  // 状态管理
  const [categories, setCategories] = useState<NovelCategory[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<NovelCategory> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 查询参数
  const [query, setQuery] = useState<CategoryListParams>({
    page: 1,
    per_page: 20,
    sort_by: 'novel_count',
    sort_order: 'desc',
  });

  // 认证检查
  useEffect(() => {
    if (!authLoading && (!user || !isAuthenticated)) {
      router.push('/login');
    }
  }, [user, authLoading, isAuthenticated, router]);

  // 获取分类数据
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategoriesPaginated(query);
      setCategories(response.data);
      setPagination(response);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('获取分类列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchCategories();
    }
  }, [query, user, isAuthenticated]);

  // 页面变更处理
  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  // 计算统计信息
  const totalNovels = categories.reduce((sum, category) => sum + category.novel_count, 0);
  const activeCategories = categories.filter(category => {
    const lastUpdate = new Date(category.updated_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastUpdate >= thirtyDaysAgo;
  });

  if (authLoading || !user || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-accent mx-auto mb-4"></div>
          <p className="text-light-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 页面头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-light-text mb-4
                       bg-gradient-to-r from-light-text to-light-accent bg-clip-text">
          小说分类
        </h1>
        <p className="text-lg md:text-xl text-light-text-secondary max-w-3xl mx-auto leading-relaxed">
          探索不同类型的精彩小说，找到你喜欢的故事类型
        </p>
      </div>

      {/* 统计信息 */}
      {!loading && pagination && (
        <div className="bg-light-bg-secondary border border-light-border rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-light-accent mb-2">
                {pagination.total}
              </div>
              <div className="text-light-text-secondary">个分类</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-light-accent mb-2">
                {totalNovels.toLocaleString()}
              </div>
              <div className="text-light-text-secondary">部作品</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-light-accent mb-2">
                {activeCategories.length}
              </div>
              <div className="text-light-text-secondary">活跃分类</div>
            </div>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-accent mx-auto mb-4"></div>
          <p className="text-light-text-secondary">加载分类列表中...</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-light-text mb-2">加载失败</h3>
          <p className="text-light-text-secondary mb-4">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-4 py-2 bg-light-accent text-white rounded-lg hover:bg-light-accent-hover transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {/* 分类网格 */}
      {!loading && !error && (
        <div className="space-y-8">
          {categories.length > 0 ? (
            <>
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-light-text mb-2">
                      所有分类
                    </h2>
                    <p className="text-light-text-secondary">浏览全部小说分类</p>
                  </div>
                  {pagination && (
                    <div className="text-sm text-light-text-secondary">
                      显示 {pagination.from}-{pagination.to} / 共 {pagination.total} 个分类
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </section>

              {/* 分页控件 */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    showPageInfo={true}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-light-text mb-2">暂无分类</h3>
              <p className="text-light-text-secondary">
                目前还没有可用的小说分类
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
