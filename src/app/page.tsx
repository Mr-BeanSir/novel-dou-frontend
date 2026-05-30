import NovelCard from '@/components/novel/card/NovelCard';
import SearchForm from '@/components/home/SearchForm';
import { serverGet } from '@/lib/auth-server';
import type { Novel } from '@/types/novel';

export const dynamic = 'force-dynamic';

// 服务端获取数据
async function getHomeData() {
  try {
    // 并行获取所有数据
    const [recommendedResponse, popularResponse, recentResponse] = await Promise.all([
      serverGet<{ novels: Novel[]; pagination: any }>('/novels/recommended?per_page=8'),
      serverGet<{ novels: Novel[]; pagination: any }>('/novels/popular?per_page=8'),
      serverGet<{ novels: Novel[]; pagination: any }>('/novels/recent?per_page=8'),
    ]);

    return {
      recommendedNovels: recommendedResponse.novels,
      popularNovels: popularResponse.novels,
      recentNovels: recentResponse.novels,
    };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return {
      recommendedNovels: [],
      popularNovels: [],
      recentNovels: [],
    };
  }
}

export default async function Home() {
  // 服务端获取数据
  const { recommendedNovels, popularNovels, recentNovels } = await getHomeData();



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 英雄区域 */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-6
                       bg-gradient-to-r from-theme-text to-theme-accent bg-clip-text">
          欢迎来到读书豆
        </h1>
        <p className="text-lg md:text-xl text-theme-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
          发现优质小说，享受阅读乐趣。海量小说资源，精彩内容等你探索。
        </p>
        
        {/* 搜索框 */}
        <SearchForm />
      </section>

      {/* 推荐小说 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-theme-text mb-2">
              编辑推荐
            </h2>
            <p className="text-theme-text-secondary">精选优质小说，为您推荐</p>
          </div>
          <a
            href="/recommended"
            className="text-theme-accent hover:text-theme-accent-hover
                     hover:underline transition-theme flex items-center gap-1
                     font-medium"
          >
            查看更多
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedNovels.length > 0 ? (
            recommendedNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-theme-text-secondary">
                暂无推荐小说
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 热门小说 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-theme-text mb-2">
              热门小说
            </h2>
            <p className="text-theme-text-secondary">读者热捧，口碑之选</p>
          </div>
          <a
            href="/popular"
            className="text-theme-accent hover:text-theme-accent-hover
                     hover:underline transition-theme flex items-center gap-1
                     font-medium"
          >
            查看更多
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularNovels.length > 0 ? (
            popularNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-theme-text-secondary">
                暂无热门小说
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 最近更新 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-theme-text mb-2">
              最近更新
            </h2>
            <p className="text-theme-text-secondary">新鲜出炉，持续更新</p>
          </div>
          <a
            href="/recent"
            className="text-theme-accent hover:text-theme-accent-hover
                     hover:underline transition-theme flex items-center gap-1
                     font-medium"
          >
            查看更多
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentNovels.length > 0 ? (
            recentNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-theme-text-secondary">
                暂无最近更新
              </p>
            </div>
          )}
        </div>
      </section>


    </div>
  );
}
