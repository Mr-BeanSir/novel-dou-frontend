import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            小说不存在
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            抱歉，您访问的小说不存在或已被删除。
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-light-accent hover:bg-light-accent-hover 
                     dark:bg-dark-accent dark:hover:bg-dark-accent-hover 
                     text-white rounded-lg transition-colors"
          >
            返回首页
          </Link>
          
          <div>
            <Link
              href="/search"
              className="text-light-accent dark:text-dark-accent hover:underline"
            >
              搜索其他小说
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
