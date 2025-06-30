'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useInitialize } from '@/stores/user';

interface UserContextType {
  // 这个 Provider 主要用于初始化，不需要额外的 context 值
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const initialize = useInitialize();

  // 应用启动时初始化用户状态
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <UserContext.Provider value={{}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
