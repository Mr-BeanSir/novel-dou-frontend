'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
// UserProvider 暂时不需要初始化，因为简化版store不需要复杂的初始化逻辑

interface UserContextType {
  // 这个 Provider 主要用于初始化，不需要额外的 context 值
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // 简化版store不需要复杂的初始化逻辑
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
