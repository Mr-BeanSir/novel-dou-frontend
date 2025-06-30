'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { Novel, NovelChapter, ChapterContentResponse } from '@/types/novel';

interface ChapterNavigationProps {
  novel: Novel;
  currentChapter: NovelChapter;
  prevChapter: NovelChapter | null;
  nextChapter: NovelChapter | null;
  chapterContent?: ChapterContentResponse | null;
}

export default function ChapterNavigation({
  novel,
  currentChapter,
  prevChapter,
  nextChapter,
  chapterContent
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
                    {prevChapter.title.replace(/^第\d+章\s*/, '')}
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
                    {nextChapter.title.replace(/^第\d+章\s*/, '')}
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
      </div>
    </footer>
  );
}
