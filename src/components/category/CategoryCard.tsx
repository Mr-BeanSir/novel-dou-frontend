'use client';

import Link from 'next/link';
import type { NovelCategory } from '@/types/novel';

interface CategoryCardProps {
  category: NovelCategory;
  className?: string;
}

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  return (
    <div className={`group ${className}`}>
      <Link href={`/novels?category_id=${category.id}`}>
        <div className="border border-[#E5D5B7] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-theme-accent/10
                        transition-all duration-300 hover:scale-[1.03]
                        group cursor-pointer">
          {/* 封面图片 */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#E5D5B7]">
            {category.cover_image ? (
              <img
                src={category.cover_image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-theme-border to-theme-bg-secondary
                            flex items-center justify-center relative overflow-hidden">
                {/* 背景装饰 */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-8 h-8 border-2 border-theme-accent rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-theme-accent rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-theme-accent rounded-full"></div>
                </div>

                <div className="relative z-10 text-center">
                  <svg
                    className="w-16 h-16 text-theme-text-secondary/60 mx-auto mb-2
                             group-hover:text-theme-accent/80 transition-theme"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p className="text-base text-theme-text-secondary/50 font-medium">分类封面</p>
                </div>
              </div>
            )}
          </div>

          {/* 内容区域 */}
          <div className="p-5 bg-light-bg-secondary">
            {/* 分类名称 */}
            <h3 className="font-bold text-xl text-light-text mb-3
                         group-hover:text-light-accent transition-colors duration-200 leading-tight">
              {category.name}
            </h3>

            {/* 描述 */}
            {category.description && (
              <p className="text-sm text-light-text-secondary line-clamp-2 mb-4 leading-relaxed">
                {category.description}
              </p>
            )}

            {/* 统计信息 */}
            <div className="flex items-center justify-between text-sm text-theme-text-secondary">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{formatNumber(category.novel_count)} 部作品</span>
              </div>

              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 fill-current text-theme-accent" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
