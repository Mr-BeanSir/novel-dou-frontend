import { redirect } from 'next/navigation';
import CategoryCard from '@/components/category/CategoryCard';
import { serverGet } from '@/lib/auth-server';
import { getServerUser } from '@/lib/auth-server';
import type { NovelCategory } from '@/types/novel';

// 服务端获取分类数据
async function getCategoriesData() {
  try {
    const response = await serverGet<{ categories: NovelCategory[] }>('/novels/categories/all');
    return response.categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  // 服务端认证检查
  const user = await getServerUser();
  if (!user) {
    redirect('/login');
  }

  // 服务端获取数据
  const categories = await getCategoriesData();

  // 按活跃状态和排序字段排序
  const sortedCategories = categories
    .filter(category => category.is_active)
    .sort((a, b) => {
      // 首先按 sort_order 排序
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      // 然后按小说数量排序
      return b.novel_count - a.novel_count;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 页面头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4
                       bg-gradient-to-r from-theme-text to-theme-accent bg-clip-text">
          小说分类
        </h1>
        <p className="text-lg md:text-xl text-theme-text-secondary max-w-3xl mx-auto leading-relaxed">
          探索不同类型的精彩小说，找到你喜欢的故事类型
        </p>
      </div>

      {/* 统计信息 */}
      <div className="bg-[#F9F3D2] border border-[#E5D5B7] rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-theme-accent mb-2">
              {sortedCategories.length}
            </div>
            <div className="text-theme-text-secondary">个分类</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-theme-accent mb-2">
              {sortedCategories.reduce((sum, cat) => sum + cat.novel_count, 0).toLocaleString()}
            </div>
            <div className="text-theme-text-secondary">部作品</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-theme-accent mb-2">
              {sortedCategories.filter(cat => cat.novel_count > 0).length}
            </div>
            <div className="text-theme-text-secondary">活跃分类</div>
          </div>
        </div>
      </div>

      {/* 分类网格 */}
      <div className="space-y-8">
        {sortedCategories.length > 0 ? (
          <>
            {/* 热门分类 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-theme-text mb-2">
                    热门分类
                  </h2>
                  <p className="text-theme-text-secondary">作品数量最多的分类</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedCategories
                  .filter(category => category.novel_count >= 10)
                  .slice(0, 8)
                  .map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
              </div>
            </section>

            {/* 所有分类 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-theme-text mb-2">
                    所有分类
                  </h2>
                  <p className="text-theme-text-secondary">浏览全部小说分类</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-theme-text mb-2">暂无分类</h3>
            <p className="text-theme-text-secondary">
              目前还没有可用的小说分类
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
