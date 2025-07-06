'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到登录页面的注册模式
    router.replace('/login?mode=register');
  }, [router]);

  return null;
}
