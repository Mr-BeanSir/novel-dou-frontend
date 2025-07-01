'use client';

import { ReactNode } from 'react';

interface ProfileLayoutProps {
  children: ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {children}
    </div>
  );
}
