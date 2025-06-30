export default function ChapterLoading() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* 顶部导航栏骨架 */}
      <div className="sticky top-0 z-10 bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
              <div className="w-32 h-6 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域骨架 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 章节标题骨架 */}
        <div className="text-center mb-8">
          <div className="w-64 h-8 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded mx-auto mb-4 animate-pulse"></div>
          <div className="w-48 h-6 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded mx-auto animate-pulse"></div>
        </div>

        {/* 章节内容骨架 */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="w-full h-6 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
                <div className="w-full h-6 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
                <div className="w-3/4 h-6 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部导航骨架 */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-light-border dark:border-dark-border">
          <div className="w-24 h-10 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
          <div className="w-32 h-6 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
          <div className="w-24 h-10 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
