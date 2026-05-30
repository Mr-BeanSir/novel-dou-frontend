import { serverGet } from '@/lib/auth-server';
import { API_CONFIG } from '@/config/api';
import TagCard from '@/components/tag/TagCard';
import { Pagination } from '@/components/ui/Pagination';
import type { NovelTag, TagStatisticsResponse } from '@/types/novel';

export const dynamic = 'force-dynamic';

interface TagsResponse {
  tags: NovelTag[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export default async function TagsPage() {
  // 服务端获取数据
  let tags: NovelTag[] = [];
  let pagination = null;
  let statistics: TagStatisticsResponse | null = null;

  try {
    const [tagsResponse, statsResponse] = await Promise.all([
      serverGet<TagsResponse>(
        `${API_CONFIG.ENDPOINTS.NOVELS.TAGS_LIST}?page=1&per_page=24&sort_by=novel_count&sort_order=desc`
      ),
      serverGet<TagStatisticsResponse>(API_CONFIG.ENDPOINTS.NOVELS.TAGS_STATISTICS),
    ]);
    tags = tagsResponse.tags;
    pagination = tagsResponse.pagination;
    statistics = statsResponse;
  } catch (error) {
    console.error('Failed to fetch tags:', error);
  }

  const hotTags = tags.filter(tag => tag.novel_count >= 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 页面头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-light-text mb-4
                       bg-gradient-to-r from-light-text to-light-accent bg-clip-text">
          小说标签
        </h1>
        <p className="text-lg md:text-xl text-light-text-secondary max-w-3xl mx-auto leading-relaxed">
          通过标签快速找到你感兴趣的小说类型和主题
        </p>
      </div>

      {/* 统计信息 */}
      {statistics && (
        <div className="bg-light-bg-secondary border border-light-border rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-light-accent mb-2">
                {statistics.statistics.total_tags}
              </div>
              <div className="text-light-text-secondary">个标签</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-light-accent mb-2">
                {statistics.statistics.total_novel_tag_relations}
              </div>
              <div className="text-light-text-secondary">标签作品总数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2 flex items-center justify-center gap-2">
                <span className="text-red-500">🔥</span>
                <span>{statistics.statistics.most_popular_tag.name}</span>
              </div>
              <div className="text-light-text-secondary">热门标签</div>
            </div>
          </div>
        </div>
      )}

      {/* 标签内容 */}
      {tags.length > 0 ? (
        <div className="space-y-12">
          {/* 热门标签 */}
          {hotTags.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-light-text mb-2 flex items-center gap-2">
                    <span className="text-red-500">🔥</span>
                    热门标签
                  </h2>
                  <p className="text-light-text-secondary">作品数量超过50部的热门标签</p>
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
                <h2 className="text-2xl font-bold text-light-text mb-2">所有标签</h2>
                <p className="text-light-text-secondary">浏览全部小说标签</p>
              </div>
              {pagination && (
                <div className="text-sm text-light-text-secondary">
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

          {pagination && pagination.last_page > 1 && (
            <div className="flex justify-center">
              <Pagination
                pagination={pagination}
                onPageChange={() => {}}
                showPageInfo={true}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-xl font-bold text-light-text mb-2">暂无标签</h3>
          <p className="text-light-text-secondary">目前还没有可用的小说标签</p>
        </div>
      )}
    </div>
  );
}
