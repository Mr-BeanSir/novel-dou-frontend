'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { useUserStore } from '@/stores/user';
import type { User } from '@/types/user';

interface UserProviderProps {
  children: ReactNode;
  /** 服务端预获取的用户数据，由 layout 传入 */
  serverUser?: User | null;
}

/**
 * 用户状态 Provider
 * 接收服务端传来的用户数据，直接注入 store。
 * 不做任何客户端 API 请求 — 认证由 proxy + 服务端 layout 处理。
 */
export function UserProvider({ children, serverUser }: UserProviderProps) {
  const setUser = useUserStore((s) => s.setUser);
  const setAuthenticated = useUserStore((s) => s.setAuthenticated);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    if (serverUser) {
      setUser(serverUser);
      setAuthenticated(true);
    }
  }, [serverUser, setUser, setAuthenticated]);

  return <>{children}</>;
}
