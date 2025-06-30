'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { Novel, NovelChapter } from '@/types/novel';

interface ChapterNavigationProps {
  novel: Novel;
  currentChapter: NovelChapter;
  prevChapter: NovelChapter | null;
  nextChapter: NovelChapter | null;
}

export default function ChapterNavigation({ 
  novel, 
  currentChapter, 
  prevChapter, 
  nextChapter 
}: ChapterNavigationProps) {
  return (
    <footer className="border-t border-light-border dark:border-dark-border 
                     bg-light-bg dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 章节导航按钮 */}
        <div className="flex items-center justify-between mb-6">
          {/* 上一章 */}
          <div className="flex-1">
            {prevChapter ? (
              <Link
                href={`/novel/${novel.id}/chapter/${prevChapter.id}`}
                className="inline-flex items-center px-4 py-3 
                         bg-light-bg-secondary dark:bg-dark-bg-secondary
                         hover:bg-light-accent dark:hover:bg-dark-accent
                         text-light-text dark:text-dark-text
                         rounded-md transition-colors duration-200
                         max-w-xs"
              >
                <ChevronLeft className="w-5 h-5 mr-2 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    上一章
                  </div>
                  <div className="font-medium truncate">
                    第{prevChapter.chapter_number}章
                  </div>
                </div>
              </Link>
            ) : (
              <div className="inline-flex items-center px-4 py-3 
                           text-light-text-secondary dark:text-dark-text-secondary
                           opacity-50 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-sm">已是第一章</div>
                </div>
              </div>
            )}
          </div>

          {/* 章节目录 */}
          <div className="flex-shrink-0 mx-4">
            <Link
              href={`/novel/${novel.id}#chapters`}
              className="inline-flex items-center px-4 py-3 
                       bg-[#c49e65] hover:bg-[#a9744f]
                       text-white rounded-md transition-colors duration-200"
            >
              <List className="w-5 h-5 mr-2" />
              目录
            </Link>
          </div>

          {/* 下一章 */}
          <div className="flex-1 flex justify-end">
            {nextChapter ? (
              <Link
                href={`/novel/${novel.id}/chapter/${nextChapter.id}`}
                className="inline-flex items-center px-4 py-3 
                         bg-light-bg-secondary dark:bg-dark-bg-secondary
                         hover:bg-light-accent dark:hover:bg-dark-accent
                         text-light-text dark:text-dark-text
                         rounded-md transition-colors duration-200
                         max-w-xs"
              >
                <div className="min-w-0 text-right">
                  <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    下一章
                  </div>
                  <div className="font-medium truncate">
                    第{nextChapter.chapter_number}章
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 ml-2 flex-shrink-0" />
              </Link>
            ) : (
              <div className="inline-flex items-center px-4 py-3 
                           text-light-text-secondary dark:text-dark-text-secondary
                           opacity-50 cursor-not-allowed">
                <div className="text-right">
                  <div className="text-sm">已是最新章</div>
                </div>
                <ChevronRight className="w-5 h-5 ml-2" />
              </div>
            )}
          </div>
        </div>

        {/* 当前章节信息 */}
        <div className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
          <div className="mb-2">
            第{currentChapter.chapter_number}章 · {currentChapter.title}
          </div>
          <div className="space-x-4">
            <span>字数：{currentChapter.word_count_formatted}</span>
            <span>·</span>
            <span>阅读：{currentChapter.view_count.toLocaleString()}</span>
            <span>·</span>
            <span>更新：{new Date(currentChapter.updated_at).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>

        {/* 返回小说详情 */}
        <div className="text-center mt-6">
          <Link
            href={`/novel/${novel.id}`}
            className="inline-flex items-center px-6 py-2 
                     text-light-text-secondary dark:text-dark-text-secondary
                     hover:text-light-text dark:hover:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                     rounded-md transition-colors duration-200"
          >
            返回《{novel.title}》详情页
          </Link>
        </div>
      </div>
    </footer>
  );
}
