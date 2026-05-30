'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUserStore } from '@/stores/user';

interface UserContextType {
  // 这个 Provider 主要用于初始化，不需要额外的 context 值
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const initialize = useUserStore((state) => state.initialize);

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
