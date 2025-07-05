'use client';

import { useUser, useToken, useIsAuthenticated } from '@/stores/userSimple';
import { isAdmin } from '@/services/auth';

export default function TestAdminPage() {
  const user = useUser();
  const token = useToken();
  const isAuthenticated = useIsAuthenticated();
  
  const userIsAdmin = user ? isAdmin(user) : false;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border p-6">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">
            管理员权限测试页面
          </h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
                当前状态
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">是否有 Token:</span> {token ? '是' : '否'}</p>
                <p><span className="font-medium">Store 认证状态:</span> {isAuthenticated ? '已认证' : '未认证'}</p>
                <p><span className="font-medium">用户信息:</span> {user ? '已加载' : '未加载'}</p>
                {user && (
                  <>
                    <p><span className="font-medium">用户名:</span> {user.name}</p>
                    <p><span className="font-medium">邮箱:</span> {user.email}</p>
                    <p><span className="font-medium">用户组:</span> {user.user_group?.name || '未知'}</p>
                    <p><span className="font-medium">用户组描述:</span> {user.user_group?.description || '无'}</p>
                  </>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-lg ${userIsAdmin ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${userIsAdmin ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                管理员权限检查
              </h3>
              <p className={userIsAdmin ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {userIsAdmin ? '✅ 您拥有管理员权限' : '❌ 您没有管理员权限'}
              </p>
              {user && (
                <p className="text-sm mt-2 opacity-75">
                  检查逻辑: user.user_group.name === '管理员' || user.user_group.name === 'admin'
                </p>
              )}
            </div>

            {user?.user_group && (
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  用户组详细信息
                </h3>
                <pre className="text-sm text-blue-700 dark:text-blue-300 overflow-auto">
                  {JSON.stringify(user.user_group, null, 2)}
                </pre>
              </div>
            )}

            {user?.permissions && user.permissions.length > 0 && (
              <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  用户权限
                </h3>
                <div className="space-y-1">
                  {user.permissions.map((permission, index) => (
                    <div key={index} className="text-sm text-purple-700 dark:text-purple-300">
                      {permission.name} - {permission.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                调试信息
              </h3>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <p>• 此页面不会调用 API，只检查本地存储的用户信息</p>
                <p>• 管理员判断基于用户组名称，不依赖权限数组</p>
                <p>• 如果看到管理员权限但无法访问管理页面，可能是 API 调用问题</p>
              </div>
            </div>

            {userIsAdmin && (
              <div className="text-center">
                <a
                  href="/admin"
                  className="inline-block px-6 py-3 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors font-medium"
                >
                  进入管理员控制台
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
