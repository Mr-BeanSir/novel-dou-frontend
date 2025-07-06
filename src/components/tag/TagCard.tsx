'use client';

import Link from 'next/link';
import type { NovelTag } from '@/types/novel';

interface TagCardProps {
  tag: NovelTag;
  className?: string;
}

export default function TagCard({ tag, className = '' }: TagCardProps) {
  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  // 获取标签颜色，如果没有设置则使用默认颜色
  const tagColor = tag.color || '#c49e65';

  return (
    <div className={`group ${className}`}>
      <Link href={`/novels?tag_ids=${tag.id}`}>
        <div className="border border-light-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-light-accent/10
                        transition-all duration-300 hover:scale-[1.03]
                        group cursor-pointer bg-light-bg-secondary">
          
          {/* 标签头部 - 带颜色条 */}
          <div 
            className="h-2 w-full"
            style={{ backgroundColor: tagColor }}
          ></div>

          {/* 内容区域 */}
          <div className="p-5">
            {/* 标签名称 */}
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: tagColor }}
              ></div>
              <h3 className="font-bold text-lg text-light-text
                           group-hover:text-light-accent transition-colors duration-200 leading-tight">
                {tag.name}
              </h3>
            </div>

            {/* 描述 */}
            {tag.description && (
              <p className="text-sm text-light-text-secondary line-clamp-2 mb-4 leading-relaxed">
                {tag.description}
              </p>
            )}

            {/* 统计信息 */}
            <div className="flex items-center justify-between text-sm text-light-text-secondary">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{formatNumber(tag.novel_count)} 部作品</span>
              </div>

              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 fill-current text-light-accent" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* 热门标识 */}
            {tag.novel_count > 100 && (
              <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                热门标签
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
