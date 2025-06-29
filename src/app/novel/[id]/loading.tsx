import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 小说基本信息骨架屏 */}
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary 
                        border border-light-border dark:border-dark-border 
                        rounded-lg p-6 mb-8 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 封面图片骨架 */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 mx-auto lg:mx-0 bg-light-border dark:bg-dark-border rounded-lg"></div>
            </div>

            {/* 小说信息骨架 */}
            <div className="flex-1 min-w-0">
              {/* 标题和作者骨架 */}
              <div className="mb-4">
                <div className="h-8 bg-light-border dark:bg-dark-border rounded mb-2"></div>
                <div className="h-6 bg-light-border dark:bg-dark-border rounded w-1/3"></div>
              </div>

              {/* 分类和状态骨架 */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="h-6 bg-light-border dark:bg-dark-border rounded w-20"></div>
                <div className="h-6 bg-light-border dark:bg-dark-border rounded w-16"></div>
              </div>

              {/* 标签骨架 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 bg-light-border dark:bg-dark-border rounded w-12"></div>
                ))}
              </div>

              {/* 统计信息骨架 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="h-6 bg-light-border dark:bg-dark-border rounded mb-1"></div>
                    <div className="h-4 bg-light-border dark:bg-dark-border rounded"></div>
                  </div>
                ))}
              </div>

              {/* 操作按钮骨架 */}
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-light-border dark:bg-dark-border rounded w-32"></div>
                ))}
              </div>
            </div>
          </div>

          {/* 简介骨架 */}
          <div className="mt-6 pt-6 border-t border-light-border dark:border-dark-border">
            <div className="h-6 bg-light-border dark:bg-dark-border rounded w-24 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-light-border dark:bg-dark-border rounded"></div>
              <div className="h-4 bg-light-border dark:bg-dark-border rounded"></div>
              <div className="h-4 bg-light-border dark:bg-dark-border rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* 评分区域骨架 */}
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary 
                        border border-light-border dark:border-dark-border 
                        rounded-lg p-6 mb-8 animate-pulse">
          <div className="h-6 bg-light-border dark:bg-dark-border rounded w-24 mb-4"></div>
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="h-12 bg-light-border dark:bg-dark-border rounded w-16 mb-2"></div>
                  <div className="h-6 bg-light-border dark:bg-dark-border rounded w-20 mb-1"></div>
                  <div className="h-4 bg-light-border dark:bg-dark-border rounded w-16"></div>
                </div>
                <div className="flex-1 max-w-xs space-y-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-2 bg-light-border dark:bg-dark-border rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-80">
              <div className="h-32 bg-light-border dark:bg-dark-border rounded"></div>
            </div>
          </div>
        </div>

        {/* 章节列表骨架 */}
        <div className="mb-8">
          <div className="h-6 bg-light-border dark:bg-dark-border rounded w-24 mb-4 animate-pulse"></div>
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary 
                          border border-light-border dark:border-dark-border 
                          rounded-lg overflow-hidden animate-pulse">
            <div className="p-4 border-b border-light-border dark:border-dark-border">
              <div className="h-6 bg-light-border dark:bg-dark-border rounded w-32"></div>
            </div>
            <div className="divide-y divide-light-border dark:divide-dark-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4">
                  <div className="h-5 bg-light-border dark:bg-dark-border rounded mb-2"></div>
                  <div className="h-4 bg-light-border dark:bg-dark-border rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 评论区域骨架 */}
        <div>
          <div className="h-6 bg-light-border dark:bg-dark-border rounded w-32 mb-4 animate-pulse"></div>
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary 
                          border border-light-border dark:border-dark-border 
                          rounded-lg p-6 animate-pulse">
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
