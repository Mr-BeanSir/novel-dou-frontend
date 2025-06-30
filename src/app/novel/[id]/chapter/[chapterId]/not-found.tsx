import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function ChapterNotFound() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <BookOpen className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            章节不存在
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            抱歉，您访问的章节不存在或已被删除。
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center px-4 py-3 
                     bg-[#c49e65] hover:bg-[#a9744f] 
                     text-white rounded-md transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回首页
          </Link>

          <Link
            href="/novel"
            className="w-full flex items-center justify-center px-4 py-3 
                     border border-light-border dark:border-dark-border
                     text-light-text dark:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                     rounded-md transition-colors duration-200"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            浏览小说
          </Link>
        </div>
      </div>
    </div>
  );
}
