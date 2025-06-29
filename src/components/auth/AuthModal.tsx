'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { LoginRequest, RegisterRequest } from '@/types/user';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: '',
    password: '',
    device_name: 'web-browser',
  });

  const [registerForm, setRegisterForm] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // 重置关闭状态
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // 处理关闭动画
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(loginForm);
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (registerForm.password !== registerForm.password_confirmation) {
      setError('密码确认不匹配');
      setIsLoading(false);
      return;
    }

    try {
      await register(registerForm);
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : '注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* 背景遮罩 - 高斯模糊效果 */}
      <div
        className={`absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* 弹窗内容 */}
      <div className={`relative w-full max-w-md mx-4 bg-light-bg dark:bg-dark-bg
                      border border-light-border dark:border-dark-border
                      rounded-lg shadow-lg transition-all duration-300 ease-out ${
                        isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'
                      }`}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
            {mode === 'login' ? '登录' : '注册'}
          </h2>
          <button
            onClick={handleClose}
            className="text-light-text-secondary dark:text-dark-text-secondary
                       hover:text-light-text dark:hover:text-dark-text
                       transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 表单内容 */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border
                           bg-light-bg-secondary dark:bg-dark-bg-secondary
                           text-light-text dark:text-dark-text
                           rounded-md focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  密码
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border
                           bg-light-bg-secondary dark:bg-dark-bg-secondary
                           text-light-text dark:text-dark-text
                           rounded-md focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-light-accent dark:bg-dark-accent
                         text-light-bg dark:text-dark-bg font-medium rounded-md
                         hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  用户名
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border
                           bg-light-bg-secondary dark:bg-dark-bg-secondary
                           text-light-text dark:text-dark-text
                           rounded-md focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border
                           bg-light-bg-secondary dark:bg-dark-bg-secondary
                           text-light-text dark:text-dark-text
                           rounded-md focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  密码
                </label>
                <input
                  type="password"
                  required
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border
                           bg-light-bg-secondary dark:bg-dark-bg-secondary
                           text-light-text dark:text-dark-text
                           rounded-md focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  确认密码
                </label>
                <input
                  type="password"
                  required
                  value={registerForm.password_confirmation}
                  onChange={(e) => setRegisterForm({ ...registerForm, password_confirmation: e.target.value })}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border
                           bg-light-bg-secondary dark:bg-dark-bg-secondary
                           text-light-text dark:text-dark-text
                           rounded-md focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-light-accent dark:bg-dark-accent
                         text-light-bg dark:text-dark-bg font-medium rounded-md
                         hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                {isLoading ? '注册中...' : '注册'}
              </button>
            </form>
          )}

          {/* 切换模式 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="text-light-accent dark:text-dark-accent hover:underline"
            >
              {mode === 'login' ? '没有账号？立即注册' : '已有账号？立即登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
