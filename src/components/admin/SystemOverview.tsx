'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Tags, 
  FolderOpen, 
  TrendingUp,
  Eye,
  Heart,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import { AdminStats } from '@/types/admin';
import { AdminService } from '@/services/admin';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

export function SystemOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('加载统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          暂无统计数据
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: '总小说数',
      value: stats.total_novels,
      icon: BookOpen,
      color: 'blue',
      subtitle: `活跃: ${stats.active_novels}`
    },
    {
      title: '总用户数',
      value: stats.total_users,
      icon: Users,
      color: 'green',
      subtitle: `活跃: ${stats.active_users}`
    },
    {
      title: '分类数',
      value: stats.total_categories,
      icon: FolderOpen,
      color: 'purple',
      subtitle: '系统分类'
    },
    {
      title: '标签数',
      value: stats.total_tags,
      icon: Tags,
      color: 'orange',
      subtitle: '内容标签'
    },
    {
      title: '推荐小说',
      value: stats.recommended_novels,
      icon: Star,
      color: 'yellow',
      subtitle: '编辑推荐'
    },
    {
      title: 'VIP小说',
      value: stats.vip_novels,
      icon: CheckCircle,
      color: 'red',
      subtitle: '付费内容'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
      red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
          系统概览
        </h3>
        <button
          onClick={loadStats}
          className="px-4 py-2 text-sm bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
        >
          刷新数据
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                    {card.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 最近小说 */}
      {stats.recent_novels && stats.recent_novels.length > 0 && (
        <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-6">
          <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
            最近发布的小说
          </h4>
          <div className="space-y-3">
            {stats.recent_novels.slice(0, 5).map((novel) => (
              <div
                key={novel.id}
                className="flex items-center justify-between p-3 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg"
              >
                <div className="flex-1">
                  <h5 className="font-medium text-light-text dark:text-dark-text">
                    {novel.title}
                  </h5>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    作者: {novel.author} • 分类: {novel.category?.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    <Eye className="w-4 h-4" />
                    <span>{novel.view_count}</span>
                    <Heart className="w-4 h-4" />
                    <span>{novel.like_count}</span>
                  </div>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {new Date(novel.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最近用户 */}
      {stats.recent_users && stats.recent_users.length > 0 && (
        <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-6">
          <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
            最近注册的用户
          </h4>
          <div className="space-y-3">
            {stats.recent_users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg"
              >
                <div className="flex-1">
                  <h5 className="font-medium text-light-text dark:text-dark-text">
                    {user.name}
                  </h5>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {user.email} • {user.user_group?.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.is_active 
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                    }`}>
                      {user.is_active ? '活跃' : '禁用'}
                    </span>
                  </div>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
