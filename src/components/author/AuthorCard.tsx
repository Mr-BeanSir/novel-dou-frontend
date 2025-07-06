'use client';

import Link from 'next/link';

interface Author {
  name: string;
  novel_count: number;
  total_word_count?: number;
  latest_novel?: {
    id: number;
    title: string;
    updated_at: string;
  };
  popular_novels?: Array<{
    id: number;
    title: string;
    rating: string;
  }>;
}

interface AuthorCardProps {
  author: Author;
  className?: string;
}

export default function AuthorCard({ author, className = '' }: AuthorCardProps) {
  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  // 格式化字数
  const formatWordCount = (count: number): string => {
    if (count >= 100000000) {
      return `${(count / 100000000).toFixed(1)}亿字`;
    }
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万字`;
    }
    return `${count}字`;
  };

  // 生成作者头像（使用名字首字母）
  const getAuthorInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  // 获取头像背景色（基于名字生成）
  const getAvatarColor = (name: string): string => {
    const colors = [
      '#c49e65', '#89775f', '#a67c52', '#d4b896', 
      '#b8956f', '#9e8463', '#c2a373', '#af9268'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={`group ${className}`}>
      <Link href={`/novels?search=${encodeURIComponent(author.name)}`}>
        <div className="border border-[#E5D5B7] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-theme-accent/10
                        transition-all duration-300 hover:scale-[1.03]
                        group cursor-pointer bg-[#F9F3D2]">
          
          {/* 内容区域 */}
          <div className="p-6">
            {/* 作者头像和基本信息 */}
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: getAvatarColor(author.name) }}
              >
                {getAuthorInitial(author.name)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-theme-text mb-1
                             group-hover:text-theme-accent transition-theme leading-tight">
                  {author.name}
                </h3>
                <p className="text-sm text-theme-text-secondary">
                  {formatNumber(author.novel_count)} 部作品
                  {author.total_word_count && (
                    <span className="ml-2">· {formatWordCount(author.total_word_count)}</span>
                  )}
                </p>
              </div>
            </div>

            {/* 最新作品 */}
            {author.latest_novel && (
              <div className="mb-4 p-3 bg-[#E5D5B7] rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-theme-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-theme-text-secondary font-medium">最新作品</span>
                </div>
                <p className="text-sm text-theme-text font-medium line-clamp-1">
                  {author.latest_novel.title}
                </p>
              </div>
            )}

            {/* 热门作品 */}
            {author.popular_novels && author.popular_novels.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-theme-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-xs text-theme-text-secondary font-medium">代表作品</span>
                </div>
                <div className="space-y-1">
                  {author.popular_novels.slice(0, 2).map((novel, index) => (
                    <div key={novel.id} className="flex items-center justify-between text-sm">
                      <span className="text-theme-text line-clamp-1 flex-1">
                        {novel.title}
                      </span>
                      {parseFloat(novel.rating) > 0 && (
                        <span className="text-theme-text-secondary ml-2 flex items-center gap-1">
                          <svg className="w-3 h-3 fill-current text-yellow-500" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {novel.rating}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 查看更多指示 */}
            <div className="flex items-center justify-end text-sm text-theme-accent">
              <span className="mr-1">查看作品</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
