import { redirect } from 'next/navigation';
import TagCard from '@/components/tag/TagCard';
import { serverGet } from '@/lib/auth-server';
import { getServerUser } from '@/lib/auth-server';
import type { NovelTag } from '@/types/novel';

// 服务端获取标签数据
async function getTagsData() {
  try {
    const response = await serverGet<{ tags: NovelTag[] }>('/novels/tags/all');
    return response.tags;
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

export default async function TagsPage() {
  // 服务端认证检查
  const user = await getServerUser();
  if (!user) {
    redirect('/login');
  }

  // 服务端获取数据
  const tags = await getTagsData();

  // 按活跃状态和小说数量排序
  const sortedTags = tags
    .filter(tag => tag.is_active)
    .sort((a, b) => b.novel_count - a.novel_count);

  // 分组标签
  const hotTags = sortedTags.filter(tag => tag.novel_count >= 50);
  const popularTags = sortedTags.filter(tag => tag.novel_count >= 10 && tag.novel_count < 50);
  const otherTags = sortedTags.filter(tag => tag.novel_count < 10);

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
      <div className="bg-[#F9F3D2] border border-[#E5D5B7] rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-theme-accent mb-2">
              {sortedTags.length}
            </div>
            <div className="text-theme-text-secondary">个标签</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500 mb-2">
              {hotTags.length}
            </div>
            <div className="text-theme-text-secondary">热门标签</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {popularTags.length}
            </div>
            <div className="text-theme-text-secondary">流行标签</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-theme-accent mb-2">
              {sortedTags.reduce((sum, tag) => sum + tag.novel_count, 0).toLocaleString()}
            </div>
            <div className="text-theme-text-secondary">标签作品总数</div>
          </div>
        </div>
      </div>

      {/* 标签内容 */}
      <div className="space-y-12">
        {sortedTags.length > 0 ? (
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

            {/* 流行标签 */}
            {popularTags.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-theme-text mb-2 flex items-center gap-2">
                      <span className="text-orange-500">⭐</span>
                      流行标签
                    </h2>
                    <p className="text-theme-text-secondary">作品数量10-49部的流行标签</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {popularTags.map((tag) => (
                    <TagCard key={tag.id} tag={tag} />
                  ))}
                </div>
              </section>
            )}

            {/* 其他标签 */}
            {otherTags.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-theme-text mb-2 flex items-center gap-2">
                      <span className="text-theme-accent">📝</span>
                      其他标签
                    </h2>
                    <p className="text-theme-text-secondary">新兴和小众标签</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {otherTags.map((tag) => (
                    <TagCard key={tag.id} tag={tag} />
                  ))}
                </div>
              </section>
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
    </div>
  );
}
