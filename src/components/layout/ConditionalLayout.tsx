'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // 登录页面（包括带参数的）不显示Header和Footer
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // 其他页面显示正常布局
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg
                    text-light-text dark:text-dark-text
                    transition-colors duration-300">
      <Header />
      <main>{children}</main>
      <footer className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                       border-t border-light-border dark:border-dark-border
                       py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            © 2025 读书豆. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
