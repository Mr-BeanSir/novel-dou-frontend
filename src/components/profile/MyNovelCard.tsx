'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Novel } from '@/types/novel';
import { ChapterUploadModal } from '@/components/profile/ChapterUploadModal';

interface MyNovelCardProps {
  novel: Novel;
  onUpdate: () => void;
}

export function MyNovelCard({ novel, onUpdate }: MyNovelCardProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <>
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
        {/* 封面区域 */}
        <div className="aspect-[3/4] bg-cover-bg rounded-t-lg relative overflow-hidden">
          {novel.cover_image ? (
            <img
              src={novel.cover_image}
              alt={novel.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📖</div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  暂无封面
                </div>
              </div>
            </div>
          )}
          
          {/* 状态标签 */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(novel.status)}`}>
              {novel.status_text}
            </span>
          </div>

          {/* VIP标识 */}
          {novel.is_vip && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                VIP
              </span>
            </div>
          )}
        </div>

        {/* 内容区域 */}
        <div className="p-4">
          {/* 标题 */}
          <h3 className="font-bold text-lg text-light-text dark:text-dark-text mb-2 line-clamp-2">
            {novel.title}
          </h3>

          {/* 作者 */}
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-2">
            作者：{novel.author}
          </p>

          {/* 分类 */}
          {novel.category && (
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-3">
              分类：{novel.category.name}
            </p>
          )}

          {/* 统计信息 */}
          <div className="grid grid-cols-2 gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
            <div>字数：{novel.word_count_formatted}</div>
            <div>章节：{novel.chapter_count}</div>
            <div>阅读：{novel.view_count}</div>
            <div>收藏：{novel.bookmark_count}</div>
          </div>

          {/* 更新时间 */}
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-4">
            更新时间：{formatDate(novel.updated_at)}
          </p>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Link
              href={`/novel/${novel.id}`}
              className="flex-1 px-3 py-2 text-center bg-light-hover dark:bg-dark-hover text-light-text dark:text-dark-text rounded-lg hover:bg-wood-primary/20 transition-colors text-sm"
            >
              查看详情
            </Link>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex-1 px-3 py-2 bg-wood-primary text-white rounded-lg hover:bg-wood-primary/90 transition-colors text-sm"
            >
              上传章节
            </button>
          </div>
        </div>
      </div>

      {/* 章节上传模态框 */}
      {showUploadModal && (
        <ChapterUploadModal
          novel={novel}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}
