'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NovelCard from '@/components/novel/card/NovelCard';
import { NovelService } from '@/services/novel';
import type { Novel, NovelListParams, NovelCategory, NovelTag } from '@/types/novel';

export default function NovelsPageContent() {
  const searchParams = useSearchParams();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  // 从URL参数获取筛选条件
  const categoryId = searchParams.get('category_id');
  const tagIds = searchParams.get('tag_ids');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sort_by') || 'recent';

  // 构建查询参数
  const buildQueryParams = (page: number = 1): NovelListParams => {
    const params: NovelListParams = {
      page,
      per_page: 20,
      sort_by: sortBy as any
    };

    if (categoryId) {
      params.category_id = parseInt(categoryId);
    }

    if (tagIds) {
      params.tag_ids = tagIds;
    }

    if (search) {
      params.search = search;
    }

    return params;
  };

  // 加载小说数据
  const loadNovels = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams(page);
      const response = await NovelService.getNovels(params);

      setNovels(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total
      });
    } catch (err) {
      console.error('Failed to load novels:', err);
      setError(err instanceof Error ? err.message : '加载小说列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    loadNovels(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 初始加载和参数变化时重新加载
  useEffect(() => {
    loadNovels();
  }, [categoryId, tagIds, search, sortBy]);

  // 获取页面标题
  const getPageTitle = () => {
    if (search) {
      return `搜索结果：${search}`;
    }
    if (categoryId) {
      return '分类小说';
    }
    if (tagIds) {
      return '标签小说';
    }
    return '小说列表';
  };

  // 获取页面描述
  const getPageDescription = () => {
    if (search) {
      return `为您找到 ${pagination.total} 部相关小说`;
    }
    if (categoryId || tagIds) {
      return `共 ${pagination.total} 部小说`;
    }
    return '浏览所有小说作品';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 页面头部 */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-light-text mb-2">
          {getPageTitle()}
        </h1>
        <p className="text-lg text-light-text-secondary">
          {getPageDescription()}
        </p>
      </div>

      {/* 排序选项 */}
      <div className="bg-light-bg-secondary border border-light-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-light-text font-medium">排序方式：</span>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'recent', label: '最新更新' },
              { key: 'popular', label: '热门推荐' },
              { key: 'rating', label: '评分最高' },
              { key: 'created_at', label: '最新发布' }
            ].map((option) => {
              const isActive = sortBy === option.key;
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.set('sort_by', option.key);

              return (
                <a
                  key={option.key}
                  href={`?${newParams.toString()}`}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-light-accent text-white'
                      : 'bg-light-bg text-light-text hover:bg-light-accent/10 border border-light-border'
                    }`}
                >
                  {option.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-accent"></div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-bold text-light-text mb-2">加载失败</h3>
          <p className="text-light-text-secondary mb-4">{error}</p>
          <button
            onClick={() => loadNovels()}
            className="px-6 py-2 bg-light-accent text-white rounded-lg hover:bg-light-accent-hover transition-colors"
          >
            重试
          </button>
        </div>
      ) : novels.length > 0 ? (
        <>
          {/* 小说网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {novels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>

          {/* 分页 */}
          {pagination.last_page > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="px-4 py-2 bg-light-bg border border-light-border rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-light-accent/10 transition-colors"
              >
                上一页
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const page = i + 1;
                  const isActive = page === pagination.current_page;

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors
                        ${isActive
                          ? 'bg-light-accent text-white'
                          : 'bg-light-bg border border-light-border hover:bg-light-accent/10'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="px-4 py-2 bg-light-bg border border-light-border rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-light-accent/10 transition-colors"
              >
                下一页
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-light-text mb-2">暂无小说</h3>
          <p className="text-light-text-secondary">
            {search ? '没有找到相关的小说' : '该分类下暂无小说'}
          </p>
        </div>
      )}
    </div>
  );
}
