import { serverGet } from '@/lib/auth-server';
import { API_CONFIG } from '@/config/api';
import RankingPageContent from '@/components/ranking/RankingPageContent';
import type { Novel } from '@/types/novel';

export const dynamic = 'force-dynamic';

interface RankingResponse {
  novels: Novel[];
}

export default async function RankingsPage() {
  // 服务端获取初始排行榜数据
  let initialNovels: Novel[] = [];
  try {
    const response = await serverGet<RankingResponse>(
      `${API_CONFIG.ENDPOINTS.NOVELS.RANKING}?type=view&period=all&per_page=50`
    );
    initialNovels = response.novels || [];
  } catch (error) {
    console.error('Failed to load ranking data:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 页面头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-light-text mb-4
                       bg-gradient-to-r from-light-text to-light-accent bg-clip-text">
          小说排行榜
        </h1>
        <p className="text-lg md:text-xl text-light-text-secondary max-w-3xl mx-auto leading-relaxed">
          发现最受欢迎的小说，追踪热门趋势
        </p>
      </div>

      {/* 排行榜统计概览 */}
      <div className="bg-light-bg-secondary border border-light-border rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-light-accent">📊 浏览排行</div>
            <div className="text-sm text-light-text-secondary">根据小说浏览量排序</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-light-accent">❤️ 收藏排行</div>
            <div className="text-sm text-light-text-secondary">根据收藏数量排序</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-light-accent">⭐ 评分排行</div>
            <div className="text-sm text-light-text-secondary">根据用户评分排序</div>
          </div>
        </div>
      </div>

      {/* 排行榜内容（客户端交互组件） */}
      <RankingPageContent initialNovels={initialNovels} />

      {/* 说明信息 */}
      <div className="mt-12 bg-light-bg-secondary border border-light-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-light-text mb-4">排行榜说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-light-text-secondary">
          <div>
            <h4 className="font-medium text-light-text mb-2">📈 浏览排行</h4>
            <p>根据小说的总浏览量进行排序，反映小说的受关注程度。</p>
          </div>
          <div>
            <h4 className="font-medium text-light-text mb-2">💖 收藏排行</h4>
            <p>根据用户收藏数量排序，体现读者对小说的喜爱程度。</p>
          </div>
          <div>
            <h4 className="font-medium text-light-text mb-2">⭐ 评分排行</h4>
            <p>根据用户评分的平均值排序，反映小说的质量水平。</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-light-border">
          <h4 className="font-medium text-light-text mb-2">🕒 时间段说明</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-light-text-secondary">
            <div><span className="font-medium text-light-text">总榜：</span>统计所有时间的数据</div>
            <div><span className="font-medium text-light-text">月榜：</span>统计最近30天的数据</div>
            <div><span className="font-medium text-light-text">周榜：</span>统计最近7天的数据</div>
          </div>
        </div>
      </div>
    </div>
  );
}
