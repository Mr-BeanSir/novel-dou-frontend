'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToTop } from '@/helpers/utils';

/**
 * ScrollToTop 组件
 * 监听路由变化，在页面切换时自动滚动到顶部
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 当路径变化时，滚动到顶部
    // 使用 setTimeout 确保页面内容已经渲染完成
    const timer = setTimeout(() => {
      scrollToTop(true); // 使用平滑滚动
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  // 这个组件不渲染任何内容
  return null;
}
