'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { AuthService } from '@/services/auth';
import { useUserStore } from '@/stores/userSimple';
import { useToast } from '@/providers/ToastProvider';
import type { LoginRequest, RegisterRequest } from '@/types/user';

// 登录页面背景图片配置
const LOGIN_BACKGROUND_IMAGES = [
  'login-left-cover.jpg',
  'login-left-cover-1.jpg',
  'login-left-cover-2.jpg',
  'login-left-cover-3.jpg',
  'login-left-cover-4.jpg',
  'login-left-cover-5.jpg',
  // 可以继续添加更多图片
];

// 随机选择背景图片
const getRandomBackgroundImage = (): string => {
  const randomIndex = Math.floor(Math.random() * LOGIN_BACKGROUND_IMAGES.length);
  return `/asset/image/login/${LOGIN_BACKGROUND_IMAGES[randomIndex]}`;
};

// 预加载图片
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export default function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken, setAuthenticated } = useUserStore();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // 从URL参数获取初始模式
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 随机背景图片
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

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

  // 同步URL参数和模式状态
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'register') {
      setMode('register');
    } else {
      setMode('login');
    }
  }, [searchParams]);

  // 设置随机背景图片
  useEffect(() => {
    const selectedImage = getRandomBackgroundImage();
    setBackgroundImage(selectedImage);

    // 预加载图片
    preloadImage(selectedImage)
      .then(() => {
        console.log('Background image preloaded successfully:', selectedImage);
      })
      .catch((error) => {
        console.warn('Failed to preload background image:', error);
      });
  }, []);

  // 处理图片加载
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // 处理图片加载错误
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    console.warn('Failed to load background image:', backgroundImage);

    // 如果当前图片加载失败，尝试使用默认图片
    if (backgroundImage !== '/asset/image/login/login-left-cover.jpg') {
      setBackgroundImage('/asset/image/login/login-left-cover.jpg');
    }
  };

  // 切换模式并更新URL
  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);

    // 更新URL参数
    const params = new URLSearchParams(searchParams.toString());
    if (newMode === 'register') {
      params.set('mode', 'register');
    } else {
      params.delete('mode'); // 登录模式不需要参数
    }

    // 使用replace避免在浏览器历史中创建新条目
    const newUrl = params.toString() ? `/login?${params.toString()}` : '/login';
    router.replace(newUrl);
  };

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.login(loginForm);
      const { user, message } = response;

      showToast(message || '登录成功', 'success');
      // 登录成功后直接跳转，cookie已在服务端设置
      window.location.href = '/';
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
      const response = await AuthService.register(registerForm);
      const { user, message } = response;

      showToast(message || '注册成功', 'success');
      // 注册成功后直接跳转，cookie已在服务端设置
      window.location.href = '/';
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
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="读书豆登录背景"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectFit: 'cover' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* 加载占位符 */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-light-accent/20 to-light-accent/40 dark:from-dark-accent/20 dark:to-dark-accent/40 flex items-center justify-center">
            <div className="text-center text-light-text dark:text-dark-text">
              <div className="w-16 h-16 border-4 border-light-accent dark:border-dark-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm opacity-70">加载背景图片...</p>
            </div>
          </div>
        )}

        {/* 错误占位符 */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-light-accent/20 to-light-accent/40 dark:from-dark-accent/20 dark:to-dark-accent/40"></div>
        )}
        
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
                onClick={() => handleModeChange('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                  mode === 'login'
                    ? 'bg-light-accent dark:bg-dark-accent text-white'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
                }`}
              >
                登录
              </button>
              <button
                onClick={() => handleModeChange('register')}
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
