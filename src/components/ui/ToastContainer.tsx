'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import Toast from './Toast';
import type { Toast as ToastType } from '@/types/user';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemoveToast: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const container = (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={onRemoveToast} />
        </div>
      ))}
    </div>
  );

  return createPortal(container, document.body);
}
