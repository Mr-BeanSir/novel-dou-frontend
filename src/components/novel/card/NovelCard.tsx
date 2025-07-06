'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Novel } from '@/types/novel';

interface NovelCardProps {
  novel: Novel;
  className?: string;
}

export default function NovelCard({ novel, className = '' }: NovelCardProps) {
  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  // 获取状态文本 - 直接使用后端返回的 status_text
  const getStatusText = (): string => {
    return novel.status_text || novel.status;
  };

  // 获取状态颜色
  const getStatusColor = (status: Novel['status']): string => {
    const colorMap = {
      draft: 'text-gray-500',
      serializing: 'text-green-600',
      completed: 'text-blue-600',
      paused: 'text-yellow-600',
    };
    return colorMap[status] || 'text-gray-500';
  };

  return (
    <div className={`group ${className}`}>
      <Link href={`/novel/${novel.id}`}>
        <div className="border border-light-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-light-accent/10
                        transition-all duration-300 hover:scale-[1.03]
                        group cursor-pointer">
          {/* 封面图片 */}
          <div className="relative aspect-[3/4] overflow-hidden bg-light-border">
            {novel.cover_image ? (
              <Image
                src={novel.cover_image}
                alt={novel.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-light-border to-light-bg-secondary
                            flex items-center justify-center relative overflow-hidden">
                {/* 背景装饰 */}
                <div className="absolute inset-0 bg-gradient-to-br from-light-accent/5 to-transparent"></div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-light-accent/10 rounded-full"></div>
                <div className="absolute bottom-6 left-6 w-4 h-4 bg-light-accent/20 rounded-full"></div>

                <div className="relative z-10 text-center">
                  <svg
                    className="w-16 h-16 text-light-text-secondary/60 mx-auto mb-2
                             group-hover:text-light-accent/80 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <p className="text-base text-light-text-secondary/50 font-medium">小说封面</p>
                </div>
              </div>
            )}
            
            {/* VIP 标识 */}
            {novel.is_vip && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white 
                            px-2 py-1 rounded text-xs font-medium">
                VIP
              </div>
            )}
            
            {/* 推荐标识 */}
            {novel.is_recommended && (
              <div className="absolute top-2 left-2 bg-red-500 text-white 
                            px-2 py-1 rounded text-xs font-medium">
                推荐
              </div>
            )}
          </div>

          {/* 内容区域 */}
          <div className="p-5 bg-light-bg-secondary">
            {/* 标题 */}
            <h3 className="font-bold text-lg text-light-text line-clamp-2 mb-3
                         group-hover:text-light-accent transition-colors duration-200 leading-tight">
              {novel.title}
            </h3>

            {/* 作者 */}
            <p className="text-sm text-light-text-secondary mb-3 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {novel.author}
            </p>

            {/* 简介 */}
            <p className="text-sm text-light-text-secondary line-clamp-3 mb-4 leading-relaxed">
              {novel.description}
            </p>

            {/* 标签 */}
            {novel.tags && novel.tags.length > 0 && (
              <div className="flex items-center gap-1 mb-3 overflow-hidden" style={{ height: '1.5rem' }}>
                {novel.tags.length <= 4 ? (
                  // 如果标签数量 <= 4，全部显示
                  novel.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs rounded font-medium text-white text-shadow-sm whitespace-nowrap flex-shrink-0"
                      style={{
                        backgroundColor: tag.color || '#c49e65',
                        fontSize: '10px'
                      }}
                    >
                      {tag.name}
                    </span>
                  ))
                ) : (
                  // 如果标签数量 > 4，显示前3个 + +X
                  <>
                    {novel.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 text-xs rounded font-medium text-white text-shadow-sm whitespace-nowrap flex-shrink-0"
                        style={{
                          backgroundColor: tag.color || '#c49e65',
                          fontSize: '10px'
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                    <span className="px-2 py-1 text-xs text-light-text-secondary whitespace-nowrap flex-shrink-0">
                      +{novel.tags.length - 3}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* 统计信息 - 网格对齐布局 */}
            <div className="grid grid-cols-3 gap-2 text-xs text-light-text-secondary">
              {/* 第一行 */}
              <div className="text-left">
                <span>{novel.word_count_formatted || `${formatNumber(novel.word_count)}字`}</span>
              </div>
              <div className="text-center">
                <span>{novel.chapter_count}章</span>
              </div>
              <div className="text-right">
                <span className={getStatusColor(novel.status)}>
                  {getStatusText()}
                </span>
              </div>

              {/* 第二行 */}
              <div className="flex items-center justify-start gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{formatNumber(novel.view_count)}</span>
              </div>

              <div className="flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{formatNumber(novel.bookmark_count)}</span>
              </div>

              <div className="flex items-center justify-end gap-1">
                {parseFloat(novel.rating) > 0 ? (
                  <>
                    <svg className="w-3 h-3 fill-current text-yellow-500" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>
                      {novel.rating} ({formatNumber(novel.rating_count)})
                    </span>
                  </>
                ) : (
                  <span>暂无评分</span>
                )}
              </div>
            </div>


          </div>
        </div>
      </Link>
    </div>
  );
}
