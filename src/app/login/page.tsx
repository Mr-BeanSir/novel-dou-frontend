'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userSimple';
import LoginPageContent from '@/components/auth/LoginPageContent';

export default function Login() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    // 如果用户已登录，重定向到首页
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // 如果已登录，不渲染登录页面
  if (isAuthenticated) {
    return null;
  }

  // 现在通过ConditionalLayout，登录页面不会显示Header和Footer
  return <LoginPageContent />;
}
