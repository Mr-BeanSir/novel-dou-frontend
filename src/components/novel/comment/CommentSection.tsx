'use client';

import { useState } from 'react';
import type { NovelComment } from '@/types/novel';
import { NovelService } from '@/services/novel';
import { useAuth } from '@/hooks/useAuth';

interface CommentSectionProps {
  novelId: number;
  comments: NovelComment[];
}

export default function CommentSection({ novelId, comments: initialComments }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<NovelComment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // 格式化时间
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 提交评论
  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    if (!newComment.trim()) {
      alert('请输入评论内容');
      return;
    }

    try {
      setIsSubmitting(true);
      await NovelService.addComment(novelId, newComment.trim());
      
      // 重新加载评论列表
      const response = await NovelService.getComments(novelId, 1, 10);
      setComments(response.data);
      setNewComment('');
      alert('评论发表成功！');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('评论发表失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 提交回复
  const handleSubmitReply = async (parentId: number) => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    if (!replyContent.trim()) {
      alert('请输入回复内容');
      return;
    }

    try {
      setIsSubmitting(true);
      await NovelService.addComment(novelId, replyContent.trim(), undefined, parentId);
      
      // 重新加载评论列表
      const response = await NovelService.getComments(novelId, 1, 10);
      setComments(response.data);
      setReplyTo(null);
      setReplyContent('');
      alert('回复发表成功！');
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('回复发表失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 点赞评论
  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    try {
      await NovelService.likeComment(commentId);
      
      // 更新评论列表中的点赞数
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { 
                ...comment, 
                likes_count: comment.likes_count + (comment.is_liked ? -1 : 1),
                is_liked: !comment.is_liked 
              }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
      alert('操作失败，请重试');
    }
  };

  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary 
                    border border-light-border dark:border-dark-border 
                    rounded-lg overflow-hidden">
      {/* 发表评论 */}
      {isAuthenticated ? (
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-light-accent dark:bg-dark-accent 
                            rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的想法..."
                className="w-full p-3 border border-light-border dark:border-dark-border 
                         rounded-md bg-light-bg dark:bg-dark-bg 
                         text-light-text dark:text-dark-text 
                         placeholder-light-text-secondary dark:placeholder-dark-text-secondary 
                         focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent 
                         resize-none"
                rows={3}
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {newComment.length}/1000
                </span>
                <button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover 
                           dark:bg-dark-accent dark:hover:bg-dark-accent-hover 
                           text-white rounded-md transition-colors 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '发表中...' : '发表评论'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 border-b border-light-border dark:border-dark-border text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-3">
            登录后可以发表评论
          </p>
          <button
            onClick={() => {
              // 这里应该触发登录弹窗
              alert('请先登录');
            }}
            className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover 
                     dark:bg-dark-accent dark:hover:bg-dark-accent-hover 
                     text-white rounded-md transition-colors"
          >
            立即登录
          </button>
        </div>
      )}

      {/* 评论列表 */}
      <div className="divide-y divide-light-border dark:divide-dark-border">
        {comments.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              暂无评论，快来发表第一条评论吧！
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-6">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-light-accent dark:bg-dark-accent 
                                rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {comment.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-light-text dark:text-dark-text">
                      {comment.user?.name || '匿名用户'}
                    </span>
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {formatTime(comment.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-light-text dark:text-dark-text mb-3 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        comment.is_liked
                          ? 'text-red-500'
                          : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={comment.is_liked ? "currentColor" : "none"} 
                           stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{comment.likes_count}</span>
                    </button>
                    
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-sm text-light-text-secondary dark:text-dark-text-secondary 
                               hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                    >
                      回复
                    </button>
                  </div>
                  
                  {/* 回复框 */}
                  {replyTo === comment.id && (
                    <div className="mt-3 pl-4 border-l-2 border-light-border dark:border-dark-border">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`回复 ${comment.user?.name || '匿名用户'}...`}
                        className="w-full p-2 border border-light-border dark:border-dark-border 
                                 rounded-md bg-light-bg dark:bg-dark-bg 
                                 text-light-text dark:text-dark-text 
                                 placeholder-light-text-secondary dark:placeholder-dark-text-secondary 
                                 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent 
                                 resize-none text-sm"
                        rows={2}
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                          {replyContent.length}/500
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => {
                              setReplyTo(null);
                              setReplyContent('');
                            }}
                            className="px-3 py-1 text-sm text-light-text-secondary dark:text-dark-text-secondary 
                                     hover:text-light-text dark:hover:text-dark-text transition-colors"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={isSubmitting || !replyContent.trim()}
                            className="px-3 py-1 text-sm bg-light-accent hover:bg-light-accent-hover 
                                     dark:bg-dark-accent dark:hover:bg-dark-accent-hover 
                                     text-white rounded transition-colors 
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? '回复中...' : '回复'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 回复列表 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-light-border dark:border-dark-border space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-2">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-light-accent dark:bg-dark-accent 
                                          rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">
                                {reply.user?.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-light-text dark:text-dark-text">
                                {reply.user?.name || '匿名用户'}
                              </span>
                              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                {formatTime(reply.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-light-text dark:text-dark-text">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
