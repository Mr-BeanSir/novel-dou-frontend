'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { AuthService } from '@/services/auth';
import { useUserStore } from '@/stores/userSimple';
import { useToast } from '@/providers/ToastProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { UserProvider } from '@/providers/UserProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import type { LoginRequest, RegisterRequest } from '@/types/user';

// 内部登录组件
function LoginPageContent() {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated } = useUserStore();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 登录表单状态
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: '',
    password: '',
    device_name: 'web-browser'
  });

  // 注册表单状态
  const [registerForm, setRegisterForm] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    user_group_id: 2 // 默认普通用户组
  });

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authResponse = await AuthService.login(loginForm);
      const { user, token } = authResponse;

      // 更新用户状态
      setUser(user);
      setToken(token);
      setAuthenticated(true);

      showToast('登录成功', 'success');
      router.push('/');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '登录失败，请检查邮箱和密码',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.password_confirmation) {
      showToast('两次输入的密码不一致', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const authResponse = await AuthService.register(registerForm);
      const { user, token } = authResponse;

      // 更新用户状态
      setUser(user);
      setToken(token);
      setAuthenticated(true);

      showToast('注册成功', 'success');
      router.push('/');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '注册失败，请检查输入信息',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex relative">
      {/* 主题切换按钮 */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg
                   bg-light-bg-secondary dark:bg-dark-bg-secondary
                   border border-light-border dark:border-dark-border
                   text-light-text dark:text-dark-text
                   hover:bg-light-hover dark:hover:bg-dark-hover
                   transition-colors duration-200"
        aria-label="切换主题"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
      {/* 左侧图片区域 - 60% */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {/* 背景图片 */}
        <img
          src="/asset/image/login/login-left-cover.jpg"
          alt="读书豆登录背景"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectFit: 'cover' }}
        />

        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>

        {/* 内容层 */}
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center text-white px-8">
            <BookOpen className="w-32 h-32 mx-auto mb-8 text-white/90" />
            <h1 className="text-4xl font-bold mb-4 text-white">读书豆</h1>
            <p className="text-xl text-white/90 mb-2">
              优质小说阅读平台
            </p>
            <p className="text-lg text-white/80">
              发现精彩故事，享受阅读时光
            </p>
          </div>
        </div>
      </div>

      {/* 右侧表单区域 - 40% */}
      <div className="w-full lg:w-2/5 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
          {/* 移动端标题 */}
          <div className="lg:hidden text-center mb-8">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-light-accent dark:text-dark-accent" />
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">读书豆</h1>
          </div>

          {/* 模式切换 */}
          <div className="flex mb-8 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                mode === 'login'
                  ? 'bg-light-accent dark:bg-dark-accent text-white'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                mode === 'register'
                  ? 'bg-light-accent dark:bg-dark-accent text-white'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              注册
            </button>
          </div>

          {/* 登录表单 */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-light-border dark:border-dark-border
                           bg-light-bg-secondary dark:bg-dark-bg-secondary
                           text-light-text dark:text-dark-text
                           rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                           transition-colors duration-200"
                  placeholder="请输入邮箱地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-light-border dark:border-dark-border
                             bg-light-bg-secondary dark:bg-dark-bg-secondary
                             text-light-text dark:text-dark-text
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                             transition-colors duration-200"
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2
                             text-light-text-secondary dark:text-dark-text-secondary
                             hover:text-light-text dark:hover:text-dark-text
                             transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-light-accent dark:bg-dark-accent
                         text-white font-medium rounded-lg
                         hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </form>
          )}

          {/* 注册表单 */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-light-border dark:border-dark-border
                           bg-light-bg-secondary dark:bg-dark-bg-secondary
                           text-light-text dark:text-dark-text
                           rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                           transition-colors duration-200"
                  placeholder="请输入用户名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-light-border dark:border-dark-border
                           bg-light-bg-secondary dark:bg-dark-bg-secondary
                           text-light-text dark:text-dark-text
                           rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                           transition-colors duration-200"
                  placeholder="请输入邮箱地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-light-border dark:border-dark-border
                             bg-light-bg-secondary dark:bg-dark-bg-secondary
                             text-light-text dark:text-dark-text
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                             transition-colors duration-200"
                    placeholder="请输入密码（至少8位）"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2
                             text-light-text-secondary dark:text-dark-text-secondary
                             hover:text-light-text dark:hover:text-dark-text
                             transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  确认密码
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={registerForm.password_confirmation}
                    onChange={(e) => setRegisterForm({ ...registerForm, password_confirmation: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-light-border dark:border-dark-border
                             bg-light-bg-secondary dark:bg-dark-bg-secondary
                             text-light-text dark:text-dark-text
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                             transition-colors duration-200"
                    placeholder="请再次输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2
                             text-light-text-secondary dark:text-dark-text-secondary
                             hover:text-light-text dark:hover:text-dark-text
                             transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-light-accent dark:bg-dark-accent
                         text-white font-medium rounded-lg
                         hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                {isLoading ? '注册中...' : '注册'}
              </button>
            </form>
          )}
          </div>
        </div>

        {/* Footer - 只在右侧显示 */}
        <footer className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                         border-t border-light-border dark:border-dark-border
                         py-6 px-8">
          <div className="text-center">
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
              © 2025 读书豆. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// 主要导出组件 - 包含完整HTML结构
export default function LoginPage() {
  return (
    <ThemeProvider defaultTheme="system">
      <UserProvider>
        <ToastProvider>
          <div className="min-h-screen bg-light-bg dark:bg-dark-bg
                          text-light-text dark:text-dark-text
                          transition-colors duration-300">
            <LoginPageContent />
          </div>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
