'use client';

import { User } from '@/types/user';

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-6">
        {/* 头像 */}
        <div className="w-20 h-20 bg-wood-primary/20 rounded-full flex items-center justify-center bg-light-accent dark:bg-dark-accent">
          <span className="text-2xl font-bold text-wood-primary text-light-bg dark:text-dark-bg">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* 用户信息 */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            {user.name}
          </h1>
          <div className="space-y-1 text-light-text-secondary dark:text-dark-text-secondary">
            <p>
              <span className="inline-block w-16">邮箱：</span>
              {user.email}
            </p>
            <p>
              <span className="inline-block">加入时间：</span>
              {formatDate(user.created_at)}
            </p>
            {user.email_verified_at && (
              <p className="text-green-600 dark:text-green-400">
                ✓ 邮箱已验证
              </p>
            )}
          </div>
        </div>

        {/* 状态标识 */}
        <div className="text-right">
          <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${user.is_active 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }
          `}>
            {user.is_active ? '活跃用户' : '已停用'}
          </div>
        </div>
      </div>
    </div>
  );
}
