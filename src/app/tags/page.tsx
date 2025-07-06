'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TagCard from '@/components/tag/TagCard';
import { getTagsPaginated, getTagsStatistics } from '@/services/novel';
import { Pagination } from '@/components/ui/Pagination';
import { useUserStore } from '@/stores/user';
import type { NovelTag, TagListParams, PaginatedResponse, TagStatisticsResponse } from '@/types/novel';

export default function TagsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useUserStore();

  // 状态管理
  const [tags, setTags] = useState<NovelTag[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<NovelTag> | null>(null);
  const [statistics, setStatistics] = useState<TagStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 查询参数
  const [query, setQuery] = useState<TagListParams>({
    page: 1,
    per_page: 24,
    sort_by: 'novel_count',
    sort_order: 'desc',
  });

  // 认证检查
  useEffect(() => {
    if (!authLoading && (!user || !isAuthenticated)) {
      router.push('/login');
    }
  }, [user, authLoading, isAuthenticated, router]);

  // 获取标签数据
  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);

      // 并行获取标签列表和统计信息
      const [tagsResponse, statsResponse] = await Promise.all([
        getTagsPaginated(query),
        getTagsStatistics()
      ]);

      setTags(tagsResponse.data);
      setPagination(tagsResponse);
      setStatistics(statsResponse);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setError('获取标签列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchTags();
    }
  }, [query, user, isAuthenticated]);

  // 页面变更处理
  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  // 分组标签
  const hotTags = tags.filter(tag => tag.novel_count >= 50);

  if (authLoading || !user || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent mx-auto mb-4"></div>
          <p className="text-theme-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 页面头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4
                       bg-gradient-to-r from-theme-text to-theme-accent bg-clip-text">
          小说标签
        </h1>
        <p className="text-lg md:text-xl text-theme-text-secondary max-w-3xl mx-auto leading-relaxed">
          通过标签快速找到你感兴趣的小说类型和主题
        </p>
      </div>

      {/* 统计信息 */}
      {!loading && statistics && (
        <div className="bg-[#F9F3D2] border border-[#E5D5B7] rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-theme-accent mb-2">
                {statistics.statistics.total_tags}
              </div>
              <div className="text-theme-text-secondary">个标签</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-theme-accent mb-2">
                {statistics.statistics.total_novel_tag_relations}
              </div>
              <div className="text-theme-text-secondary">标签作品总数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2 flex items-center justify-center gap-2">
                <span className="text-red-500">🔥</span>
                <span>{statistics.statistics.most_popular_tag.name}</span>
              </div>
              <div className="text-theme-text-secondary">热门标签</div>
            </div>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent mx-auto mb-4"></div>
          <p className="text-theme-text-secondary">加载标签列表中...</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-theme-text mb-2">加载失败</h3>
          <p className="text-theme-text-secondary mb-4">{error}</p>
          <button
            onClick={fetchTags}
            className="px-4 py-2 bg-theme-accent text-white rounded-lg hover:bg-theme-accent-hover transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {/* 标签内容 */}
      {!loading && !error && (
        <div className="space-y-12">
          {tags.length > 0 ? (
            <>
              {/* 热门标签 */}
              {hotTags.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-theme-text mb-2 flex items-center gap-2">
                        <span className="text-red-500">🔥</span>
                        热门标签
                      </h2>
                      <p className="text-theme-text-secondary">作品数量超过50部的热门标签</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {hotTags.map((tag) => (
                      <TagCard key={tag.id} tag={tag} />
                    ))}
                  </div>
                </section>
              )}

              {/* 所有标签 */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-theme-text mb-2">
                      所有标签
                    </h2>
                    <p className="text-theme-text-secondary">浏览全部小说标签</p>
                  </div>
                  {pagination && (
                    <div className="text-sm text-theme-text-secondary">
                      显示 {pagination.from}-{pagination.to} / 共 {pagination.total} 个标签
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {tags.map((tag) => (
                    <TagCard key={tag.id} tag={tag} />
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
              <div className="text-6xl mb-4">🏷️</div>
              <h3 className="text-xl font-bold text-theme-text mb-2">暂无标签</h3>
              <p className="text-theme-text-secondary">
                目前还没有可用的小说标签
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
