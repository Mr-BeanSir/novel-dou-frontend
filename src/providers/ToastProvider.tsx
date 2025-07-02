'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ToastContainer from '@/components/ui/ToastContainer';
import type { Toast, ToastType } from '@/types/user';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, options?: Partial<Toast>) => void;
  showSuccess: (message: string, options?: Partial<Toast>) => void;
  showError: (message: string, options?: Partial<Toast>) => void;
  showWarning: (message: string, options?: Partial<Toast>) => void;
  showInfo: (message: string, options?: Partial<Toast>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback((
    message: string, 
    type: ToastType = 'info', 
    options: Partial<Toast> = {}
  ) => {
    const id = generateId();
    const toast: Toast = {
      id,
      type,
      message,
      duration: 5000,
      ...options,
    };

    setToasts(prev => [...prev, toast]);
  }, [generateId]);

  const showSuccess = useCallback((message: string, options: Partial<Toast> = {}) => {
    showToast(message, 'success', options);
  }, [showToast]);

  const showError = useCallback((message: string, options: Partial<Toast> = {}) => {
    showToast(message, 'error', { duration: 7000, ...options });
  }, [showToast]);

  const showWarning = useCallback((message: string, options: Partial<Toast> = {}) => {
    showToast(message, 'warning', options);
  }, [showToast]);

  const showInfo = useCallback((message: string, options: Partial<Toast> = {}) => {
    showToast(message, 'info', options);
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
