'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { Toast, ToastType } from '@/types/user';

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const toastIcons: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

const iconStyles: Record<ToastType, string> = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
};

export default function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = toastIcons[toast.type];
  const duration = toast.duration || 5000;

  useEffect(() => {
    // 进入动画
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // 等待退出动画完成
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border shadow-lg
        transition-all duration-300 ease-in-out transform
        ${toastStyles[toast.type]}
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
        max-w-md w-full
      `}
    >
      {/* 图标 */}
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconStyles[toast.type]}`} />
      
      {/* 内容 */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="font-medium text-sm mb-1">
            {toast.title}
          </h4>
        )}
        <p className="text-sm leading-relaxed">
          {toast.message}
        </p>
        
        {/* 操作按钮 */}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline transition-all"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      
      {/* 关闭按钮 */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="关闭通知"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* 进度条（如果有持续时间） */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-current opacity-30 transition-all ease-linear"
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
