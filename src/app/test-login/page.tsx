'use client';

import { useUserStore } from '@/stores/userSimple';
import { AuthService } from '@/services/auth';
import { useToast } from '@/providers/ToastProvider';

export default function TestLogin() {
  const { user, isAuthenticated, setUser, setToken, setAuthenticated, clearAuth } = useUserStore();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      clearAuth();
      showToast('退出登录成功', 'success');
    } catch (error) {
      showToast('退出登录失败', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-8">
          登录状态测试页面
        </h1>
        
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
            当前状态
          </h2>
          <div className="space-y-2">
            <p className="text-light-text dark:text-dark-text">
              <span className="font-medium">认证状态:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                isAuthenticated 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {isAuthenticated ? '已登录' : '未登录'}
              </span>
            </p>
            {user && (
              <>
                <p className="text-light-text dark:text-dark-text">
                  <span className="font-medium">用户ID:</span> {user.id}
                </p>
                <p className="text-light-text dark:text-dark-text">
                  <span className="font-medium">用户名:</span> {user.name}
                </p>
                <p className="text-light-text dark:text-dark-text">
                  <span className="font-medium">邮箱:</span> {user.email}
                </p>
                <p className="text-light-text dark:text-dark-text">
                  <span className="font-medium">用户组:</span> {user.user_group?.name || '未知'}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-light-accent dark:bg-dark-accent
                       text-white rounded-lg hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover
                       transition-colors duration-200"
            >
              前往登录页面
            </a>

            <a
              href="/login?mode=register"
              className="inline-block px-6 py-3 bg-green-500
                       text-white rounded-lg hover:bg-green-600
                       transition-colors duration-200"
            >
              前往注册页面
            </a>

            <a
              href="/register"
              className="inline-block px-6 py-3 bg-blue-500
                       text-white rounded-lg hover:bg-blue-600
                       transition-colors duration-200"
            >
              直接访问 /register
            </a>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg
                       hover:bg-red-600 transition-colors duration-200"
            >
              退出登录
            </button>
          )}
        </div>

        <div className="mt-8 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-6">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
            测试说明
          </h2>
          <ul className="space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
            <li>• 如果未登录，访问首页会自动重定向到登录页面</li>
            <li>• 登录页面左侧显示图片（60%），右侧显示登录/注册表单（40%）</li>
            <li>• 登录成功后会重定向到首页</li>
            <li>• 已登录用户访问登录页面会重定向到首页</li>
            <li>• 可以在此页面测试退出登录功能</li>
            <li>• <strong>新功能：</strong>切换到注册时URL会变为 /login?mode=register</li>
            <li>• <strong>新功能：</strong>刷新页面会保持当前的登录/注册模式</li>
            <li>• <strong>新功能：</strong>直接访问 /register 会重定向到注册模式</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
