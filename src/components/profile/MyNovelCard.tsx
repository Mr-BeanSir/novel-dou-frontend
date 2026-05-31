'use client';

import Link from 'next/link';
import { Novel } from '@/types/novel';

interface MyNovelCardProps {
  novel: Novel;
  onUpdate: () => void;
}

export function MyNovelCard({ novel, onUpdate }: MyNovelCardProps) {

  const getStatusColor = (status: Novel['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'serializing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <>
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        {/* 封面区域 */}
        <div className="aspect-[3/4] bg-light-border rounded-t-lg relative overflow-hidden">
          {novel.cover_image ? (
            <img
              src={novel.cover_image}
              alt={novel.title}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-light-border to-light-bg-secondary
                          flex items-center justify-center relative overflow-hidden">
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-light-accent/5 to-transparent"></div>
              <div className="absolute top-4 right-4 w-6 h-6 bg-light-accent/10 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-light-accent/20 rounded-full"></div>

              <div className="relative z-10 text-center">
                <svg
                  className="w-10 h-10 text-light-text-secondary/60 mx-auto mb-2
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
                <p className="text-xs text-light-text-secondary/50 font-medium">小说封面</p>
              </div>
            </div>
          )}

          {/* 状态标签 */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(novel.status)}`}>
              {novel.status_text}
            </span>
          </div>

          {/* VIP标识 */}
          {novel.is_vip && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                VIP
              </span>
            </div>
          )}
        </div>

        {/* 内容区域 */}
        <div className="p-2">
          {/* 标题 */}
          <h3 className="font-bold text-sm text-light-text dark:text-dark-text mb-1 line-clamp-2">
            {novel.title}
          </h3>

          {/* 作者和分类 */}
          <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
            <p className="truncate">作者：{novel.author}</p>
            {novel.category && (
              <p className="truncate">分类：{novel.category.name}</p>
            )}
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-2 gap-1 text-xs text-light-text-secondary dark:text-dark-text-secondary mb-2">
            <div className="truncate">字数：{novel.word_count_formatted}</div>
            <div className="truncate">章节：{novel.chapter_count}</div>
            <div className="truncate">阅读：{novel.view_count}</div>
            <div className="truncate">收藏：{novel.bookmark_count}</div>
          </div>

          {/* 更新时间 */}
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-2 truncate">
            更新：{formatDate(novel.updated_at)}
          </p>

          {/* 操作按钮 */}
          <div className="flex gap-1">
            <Link
              href={`/novel/${novel.id}`}
              className="flex-1 px-2 py-1.5 text-center border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text rounded hover:bg-[#c49e65]/20 hover:border-[#c49e65] transition-colors text-xs"
            >
              详情
            </Link>
            <Link
              href={`/manage/${novel.id}`}
              className="flex-1 px-2 py-1.5 text-center bg-[#c49e65] border border-[#c49e65] text-white rounded hover:bg-[#a9744f] hover:border-[#a9744f] transition-colors text-xs"
            >
              管理
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
