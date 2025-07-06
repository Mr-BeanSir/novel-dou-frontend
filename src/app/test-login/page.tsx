'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userSimple';
import { AuthService } from '@/services/auth';
import { useToast } from '@/providers/ToastProvider';

export default function TestLogin() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, setToken, setAuthenticated, clearAuth } = useUserStore();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      // 首先验证localStorage中的user-storage数据
      let shouldCallAPI = true;
      let validationMessage = '';

      if (typeof window !== 'undefined') {
        try {
          const userStorage = localStorage.getItem('user-storage');
          if (!userStorage) {
            console.log('Logout: No user-storage found in localStorage');
            validationMessage = 'localStorage中没有用户数据';
            shouldCallAPI = false;
          } else {
            const parsed = JSON.parse(userStorage);
            if (!parsed.state?.token || !parsed.state?.isAuthenticated) {
              console.log('Logout: Invalid user-storage data - missing token or authentication status', {
                hasToken: !!parsed.state?.token,
                isAuthenticated: !!parsed.state?.isAuthenticated,
                userStorage: parsed
              });
              validationMessage = `localStorage数据无效 - Token: ${!!parsed.state?.token}, 认证状态: ${!!parsed.state?.isAuthenticated}`;
              shouldCallAPI = false;
            }
          }
        } catch (parseError) {
          console.error('Logout: Failed to parse user-storage data', parseError);
          validationMessage = 'localStorage数据解析失败';
          shouldCallAPI = false;
        }
      }

      // 如果数据有效，调用后端退出登录API
      if (shouldCallAPI) {
        try {
          await AuthService.logout();
          console.log('Logout: Successfully called backend logout API');
          showToast('退出登录成功', 'success');
        } catch (apiError) {
          console.error('Logout: Backend API call failed', apiError);
          showToast('后端API调用失败，但已清除本地状态', 'error');
        }
      } else {
        console.log('Logout: Skipping API call due to invalid local storage data');
        showToast(`跳过API调用: ${validationMessage}`, 'warning');
      }

      // 清空本地状态
      clearAuth();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-storage');
      }

      // 重定向到登录页面
      router.push('/login');
    } catch (error) {
      console.error('Logout: Unexpected error during logout process', error);

      // 发生任何错误都要清空本地状态并重定向
      clearAuth();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-storage');
      }

      showToast('退出登录过程中发生错误，已清除本地状态', 'error');
      router.push('/login');
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
            <li>• 登录页面完全独立，不显示Header和Footer</li>
            <li>• 登录成功后会重定向到首页</li>
            <li>• 已登录用户访问登录页面会重定向到首页</li>
            <li>• 可以在此页面测试退出登录功能</li>
            <li>• <strong>URL路由：</strong>切换到注册时URL会变为 /login?mode=register</li>
            <li>• <strong>状态持久化：</strong>刷新页面会保持当前的登录/注册模式</li>
            <li>• <strong>路由重定向：</strong>直接访问 /register 会重定向到注册模式</li>
            <li>• <strong>已移除：</strong>Header中的登录/注册弹框已删除</li>
            <li>• <strong>已修复：</strong>退出登录现在会调用后端API并重定向到登录页面</li>
            <li>• <strong>数据验证：</strong>退出登录前会验证localStorage数据，无效时记录日志并跳过API调用</li>
            <li>• <strong>随机背景：</strong>登录页面左侧会随机显示 public/asset/image/login/ 目录中的背景图片</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
