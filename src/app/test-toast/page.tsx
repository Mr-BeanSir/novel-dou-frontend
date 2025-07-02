'use client';

import { useToast } from '@/providers/ToastProvider';

export default function TestToastPage() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-8">
          Toast 通知系统测试
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => showSuccess('这是一个成功消息！')}
            className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            显示成功消息
          </button>
          
          <button
            onClick={() => showError('这是一个错误消息！')}
            className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            显示错误消息
          </button>
          
          <button
            onClick={() => showWarning('这是一个警告消息！')}
            className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            显示警告消息
          </button>
          
          <button
            onClick={() => showInfo('这是一个信息消息！')}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            显示信息消息
          </button>
          
          <button
            onClick={() => showError('章节内容至少需要10个字符')}
            className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            模拟422错误消息
          </button>
          
          <button
            onClick={() => {
              showSuccess('第一个消息');
              setTimeout(() => showError('第二个消息'), 500);
              setTimeout(() => showWarning('第三个消息'), 1000);
            }}
            className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            显示多个消息
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
            测试说明
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            点击上面的按钮来测试不同类型的toast通知。通知应该出现在页面右上角，并在几秒后自动消失。
          </p>
        </div>
      </div>
    </div>
  );
}
