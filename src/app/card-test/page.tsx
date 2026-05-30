'use client';

import { useState, useEffect } from 'react';
import NovelCard from '@/components/novel/card/NovelCard';
import { useThemeContext } from '@/providers/ThemeProvider';

// 模拟小说数据
const mockNovels = [
  {
    id: 1,
    title: "修仙传说：九天玄女",
    author: "云中君",
    description: "一个普通少年意外获得九天玄女传承，从此踏上修仙之路，历经磨难，最终成为一代仙尊的传奇故事。",
    cover_image: undefined,
    word_count: 1250000,
    word_count_formatted: "125万字",
    chapter_count: 1250,
    view_count: 98765,
    bookmark_count: 12345,
    rating: "4.8",
    status: "serializing" as const,
    status_text: "连载中",
    is_vip: true,
    is_recommended: true,
    word_count_level: "长篇",
    rating_count: 2580,
    is_finished: false,
    is_active: true,
    tags: [
      { id: 1, name: "修仙", slug: "xiuxian", color: "#4ade80", novel_count: 120, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, name: "热血", slug: "rexue", color: "#f87171", novel_count: 95, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
      { id: 3, name: "玄幻", slug: "xuanhuan", color: "#a78bfa", novel_count: 200, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
      { id: 4, name: "冒险", slug: "maoxian", color: "#fbbf24", novel_count: 80, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" }
    ],
    category: { id: 1, name: "玄幻", slug: "xuanhuan", novel_count: 350, sort_order: 1, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-06T12:00:00Z"
  },
  {
    id: 2,
    title: "都市重生：商业帝国",
    author: "金融大亨",
    description: "重生回到十年前，凭借前世记忆在商场叱咤风云，打造属于自己的商业帝国。",
    cover_image: undefined,
    word_count: 890000,
    word_count_formatted: "89万字",
    chapter_count: 890,
    view_count: 76543,
    bookmark_count: 9876,
    rating: "4.6",
    status: "completed" as const,
    status_text: "已完结",
    is_vip: false,
    is_recommended: false,
    word_count_level: "长篇",
    rating_count: 1850,
    is_finished: true,
    is_active: true,
    tags: [
      { id: 5, name: "都市", slug: "dushi", color: "#06b6d4", novel_count: 180, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
      { id: 6, name: "重生", slug: "chongsheng", color: "#8b5cf6", novel_count: 150, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
      { id: 7, name: "商战", slug: "shangzhan", color: "#f59e0b", novel_count: 60, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" }
    ],
    category: { id: 2, name: "都市", slug: "dushi", novel_count: 280, sort_order: 2, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-05T18:00:00Z"
  },
  {
    id: 3,
    title: "星际征途：机甲战神",
    author: "星空漫步者",
    description: "在遥远的未来，人类踏足星际，主角驾驶机甲在宇宙中征战，守护人类文明。",
    cover_image: undefined,
    word_count: 567000,
    word_count_formatted: "56.7万字",
    chapter_count: 567,
    view_count: 45678,
    bookmark_count: 5432,
    rating: "4.4",
    status: "paused" as const,
    status_text: "暂停更新",
    is_vip: true,
    is_recommended: false,
    word_count_level: "中篇",
    rating_count: 980,
    is_finished: false,
    is_active: false,
    tags: [
      { id: 8, name: "科幻", slug: "kehuan", color: "#3b82f6", novel_count: 110, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
      { id: 9, name: "机甲", slug: "jijia", color: "#6b7280", novel_count: 45, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
      { id: 10, name: "星际", slug: "xingji", color: "#7c3aed", novel_count: 70, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" }
    ],
    category: { id: 3, name: "科幻", slug: "kehuan", novel_count: 190, sort_order: 3, is_active: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-04T10:00:00Z"
  }
];

export default function CardTestPage() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-light-bg text-light-text">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            卡片样式测试页面
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-light-text-secondary">
              当前主题: {resolvedTheme}
            </span>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-light-accent text-white rounded-md hover:bg-light-accent-hover transition-colors"
            >
              切换主题
            </button>
          </div>
        </div>

        <div className="mb-8 p-6 bg-light-bg-secondary rounded-lg border border-light-border">
          <h2 className="text-xl font-semibold mb-4">主题切换测试</h2>
          <p className="text-light-text-secondary mb-4">
            点击上方的"切换主题"按钮来测试卡片在不同主题下的显示效果。
            暗色模式下的卡片颜色已经过优化，应该更加柔和舒适。
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                theme === 'light'
                  ? 'bg-light-accent text-white'
                  : 'bg-light-bg border border-light-border text-light-text hover:bg-light-hover'
              }`}
            >
              亮色
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                theme === 'dark'
                  ? 'bg-light-accent text-white'
                  : 'bg-light-bg border border-light-border text-light-text hover:bg-light-hover'
              }`}
            >
              暗色
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                theme === 'system'
                  ? 'bg-light-accent text-white'
                  : 'bg-light-bg border border-light-border text-light-text hover:bg-light-hover'
              }`}
            >
              跟随系统
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">小说卡片展示</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        </div>

        <div className="bg-light-bg-secondary rounded-lg border border-light-border p-6">
          <h3 className="text-lg font-semibold mb-4">优化说明</h3>
          <ul className="space-y-2 text-light-text-secondary">
            <li>• 暗色模式下使用更柔和的背景色 (#2a2a2a)</li>
            <li>• 优化了文字颜色对比度，提高可读性</li>
            <li>• 调整了边框颜色，减少刺眼感</li>
            <li>• 优化了标签和状态指示器的颜色</li>
            <li>• 改进了悬停效果的阴影强度</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
