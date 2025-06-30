'use client';

import { ArrowLeft, Settings, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Novel, NovelChapter } from '@/types/novel';

interface ReaderHeaderProps {
  novel: Novel;
  chapter: NovelChapter;
  onToggleControls: () => void;
  showControls: boolean;
}

export default function ReaderHeader({ 
  novel, 
  chapter, 
  onToggleControls, 
  showControls 
}: ReaderHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm 
                     border-b border-light-border dark:border-dark-border">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：返回按钮和小说信息 */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <Link
              href={`/novel/${novel.id}`}
              className="flex items-center justify-center w-10 h-10 
                       text-light-text dark:text-dark-text
                       hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                       rounded-md transition-colors duration-200"
              title="返回小说详情"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-light-text dark:text-dark-text 
                           truncate max-w-xs sm:max-w-sm md:max-w-md">
                {novel.title}
              </h1>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary 
                          truncate max-w-xs sm:max-w-sm md:max-w-md">
                第{chapter.chapter_number}章 · {chapter.title}
              </p>
            </div>
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center space-x-2">
            {/* 章节目录按钮 */}
            <Link
              href={`/novel/${novel.id}#chapters`}
              className="flex items-center justify-center w-10 h-10 
                       text-light-text dark:text-dark-text
                       hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                       rounded-md transition-colors duration-200"
              title="章节目录"
            >
              <BookOpen className="w-5 h-5" />
            </Link>

            {/* 设置按钮 */}
            <button
              onClick={onToggleControls}
              className={`flex items-center justify-center w-10 h-10 
                        rounded-md transition-colors duration-200
                        ${showControls 
                          ? 'bg-[#c49e65] text-white' 
                          : 'text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                        }`}
              title="阅读设置"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
