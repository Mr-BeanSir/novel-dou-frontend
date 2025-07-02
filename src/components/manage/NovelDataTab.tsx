'use client';

import { useState, useEffect } from 'react';
import { Novel } from '@/types/novel';
import { Eye, Heart, Star, MessageCircle, BookOpen, Calendar, TrendingUp } from 'lucide-react';

interface NovelDataTabProps {
  novel: Novel;
}

export function NovelDataTab({ novel }: NovelDataTabProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Novel['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'serializing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const statsCards = [
    {
      title: '总阅读量',
      value: novel.view_count.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: '收藏数',
      value: novel.bookmark_count.toLocaleString(),
      icon: Heart,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: '评分',
      value: novel.rating || '暂无',
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: '评论数',
      value: novel.comment_count.toLocaleString(),
      icon: MessageCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: '章节数',
      value: novel.chapter_count.toLocaleString(),
      icon: BookOpen,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: '字数',
      value: novel.word_count_formatted,
      icon: TrendingUp,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 基本信息卡片 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">基本信息</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">小说标题</label>
              <p className="text-light-text dark:text-dark-text font-medium">{novel.title}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">作者</label>
              <p className="text-light-text dark:text-dark-text">{novel.author}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">分类</label>
              <p className="text-light-text dark:text-dark-text">{novel.category?.name || '未分类'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">状态</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(novel.status)}`}>
                {novel.status_text}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">创建时间</label>
              <p className="text-light-text dark:text-dark-text">{formatDate(novel.created_at)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">最后更新</label>
              <p className="text-light-text dark:text-dark-text">{formatDate(novel.updated_at)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">最新章节时间</label>
              <p className="text-light-text dark:text-dark-text">
                {novel.last_chapter_at ? formatDate(novel.last_chapter_at) : '暂无章节'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">VIP状态</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                novel.is_vip 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {novel.is_vip ? 'VIP小说' : '免费小说'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 数据统计卡片 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text">数据统计</h3>
          
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-light-accent text-white'
                    : 'bg-light-bg dark:bg-dark-bg text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
                }`}
              >
                {range === 'week' ? '本周' : range === 'month' ? '本月' : '全部'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} border border-light-border dark:border-dark-border rounded-lg p-4`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                    {stat.title}
                  </span>
                </div>
                <p className="text-xl font-bold text-light-text dark:text-dark-text">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 标签信息 */}
      {novel.tags && novel.tags.length > 0 && (
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">标签</h3>
          <div className="flex flex-wrap gap-2">
            {novel.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-light-accent/20 text-light-accent border border-light-accent/30 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
