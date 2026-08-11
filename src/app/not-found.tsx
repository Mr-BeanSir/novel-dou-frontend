import Link from 'next/link';

// 强制动态渲染，因为根布局使用了 cookies
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-light-accent dark:text-dark-accent">404</h1>
        <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mt-4">
          页面未找到
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2 mb-8">
          抱歉，您访问的页面不存在
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-light-accent dark:bg-dark-accent text-white rounded-lg
                   hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
