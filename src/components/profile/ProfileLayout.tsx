'use client';

import { ReactNode } from 'react';
import Header from '@/components/layout/Header';

interface ProfileLayoutProps {
  children: ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
