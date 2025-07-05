'use client';

import { usePageAuth } from '@/hooks/usePageAuth';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

export default function TestAuthPage() {
  const { isLoading, isAuthenticated, isAdmin, user } = usePageAuth({
    requireAuth: true,
    requireAdmin: false,
    redirectTo: '/'
  });

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 如果未通过认证检查，不渲染任何内容（会被重定向）
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border p-6">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">
            认证测试页面
          </h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ 认证状态检查通过
              </h2>
              <p className="text-green-700 dark:text-green-300">
                您已成功通过认证检查，可以访问此页面。
              </p>
            </div>

            <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
                用户信息
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">用户名:</span> {user?.name}</p>
                <p><span className="font-medium">邮箱:</span> {user?.email}</p>
                <p><span className="font-medium">用户组:</span> {user?.user_group?.name}</p>
                <p><span className="font-medium">是否为管理员:</span> {isAdmin ? '是' : '否'}</p>
                <p><span className="font-medium">账号状态:</span> {user?.is_active ? '激活' : '未激活'}</p>
              </div>
            </div>

            {user?.permissions && user.permissions.length > 0 && (
              <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
                  用户权限
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {user.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm"
                    >
                      <span className="font-medium text-blue-800 dark:text-blue-200">
                        {permission.name}
                      </span>
                      {permission.description && (
                        <p className="text-blue-600 dark:text-blue-300 text-xs mt-1">
                          {permission.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                📝 测试说明
              </h3>
              <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                <li>• 此页面使用 useAuthGuard Hook 进行认证检查</li>
                <li>• 未登录用户会被自动重定向到首页</li>
                <li>• 每次访问都会调用 /api/users/me 接口获取最新用户信息</li>
                <li>• 如果 token 无效，会自动清空 localStorage 并重定向</li>
                <li>• 管理员用户可以看到管理员控制台入口</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
