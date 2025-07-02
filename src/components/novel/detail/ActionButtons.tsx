'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Novel, NovelChapter } from '@/types/novel';
import { NovelService } from '@/services/novel';
import { useUser, useIsAuthenticated } from '@/stores/user';
import { useToast } from '@/providers/ToastProvider';

interface ActionButtonsProps {
  novel: Novel;
  firstChapter: NovelChapter | null;
}

export default function ActionButtons({ novel, firstChapter }: ActionButtonsProps) {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { showSuccess, showError, showWarning } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);



  // 处理收藏
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showWarning('请先登录');
      return;
    }

    try {
      setIsBookmarking(true);
      if (isBookmarked) {
        await NovelService.unbookmarkNovel(novel.id);
        setIsBookmarked(false);
        showSuccess('已取消收藏');
      } else {
        await NovelService.bookmarkNovel(novel.id);
        setIsBookmarked(true);
        showSuccess('收藏成功');
      }
    } catch (error) {
      console.error('Error bookmarking novel:', error);
      showError('操作失败，请重试');
    } finally {
      setIsBookmarking(false);
    }
  };

  // 开始阅读按钮
  const getReadButtonText = () => {
    if (novel.chapter_count === 0) {
      return '暂无章节';
    }
    return '开始阅读';
  };

  const getReadButtonHref = () => {
    if (novel.chapter_count === 0 || !firstChapter) {
      return '#';
    }
    return `/novel/${novel.id}/chapter/${firstChapter.id}`;
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* 开始阅读按钮 */}
      <Link
        href={getReadButtonHref()}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                   ${novel.chapter_count === 0 || !firstChapter
                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     : 'bg-[#c49e65] hover:bg-[#a9744f] text-white hover:scale-105'
                   }`}
        onClick={(e) => {
          if (novel.chapter_count === 0 || !firstChapter) {
            e.preventDefault();
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>{getReadButtonText()}</span>
        </div>
      </Link>

      {/* 收藏按钮 */}
      <button
        onClick={handleBookmark}
        disabled={isBookmarking}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 
                   border-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                   ${isBookmarked
                     ? 'bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600'
                     : 'bg-transparent border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent dark:hover:text-white'
                   }`}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{isBookmarking ? '处理中...' : (isBookmarked ? '已收藏' : '收藏')}</span>
        </div>
      </button>

      {/* 分享按钮 */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: novel.title,
              text: novel.description,
              url: window.location.href,
            });
          } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
              showSuccess('链接已复制到剪贴板');
            });
          }
        }}
        className="px-6 py-3 rounded-lg font-medium transition-all duration-200
                   bg-transparent border-2 border-light-border dark:border-dark-border
                   text-light-text dark:text-dark-text
                   hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                   hover:scale-105"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>分享</span>
        </div>
      </button>

      {/* 下载按钮（如果支持） */}
      {novel.is_finished && (
        <button
          onClick={() => {
            showWarning('下载功能开发中...');
          }}
          className="px-6 py-3 rounded-lg font-medium transition-all duration-200
                     bg-transparent border-2 border-light-border dark:border-dark-border
                     text-light-text dark:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                     hover:scale-105"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>下载</span>
          </div>
        </button>
      )}
    </div>
  );
}
