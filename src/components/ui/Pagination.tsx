'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  showQuickJump?: boolean;
  showPageInfo?: boolean;
  className?: string;
}

export function Pagination({ 
  pagination, 
  onPageChange, 
  showQuickJump = false,
  showPageInfo = true,
  className = '' 
}: PaginationProps) {
  const { current_page, last_page, total, from, to } = pagination;

  // 生成页码数组
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // 最多显示7个页码
    
    if (last_page <= maxVisible) {
      // 如果总页数不超过最大显示数，显示所有页码
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      // 复杂分页逻辑
      if (current_page <= 4) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(last_page);
      } else if (current_page >= last_page - 3) {
        // 当前页在后面
        pages.push(1);
        pages.push('ellipsis');
        for (let i = last_page - 4; i <= last_page; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push('ellipsis');
        for (let i = current_page - 1; i <= current_page + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(last_page);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handleQuickJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt((e.target as HTMLInputElement).value);
      if (page >= 1 && page <= last_page && page !== current_page) {
        onPageChange(page);
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  if (last_page <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* 分页信息 */}
      {showPageInfo && (
        <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {from && to ? (
            <>显示第 {from} - {to} 条，共 {total} 条记录</>
          ) : (
            <>第 {current_page} 页，共 {last_page} 页</>
          )}
        </div>
      )}

      {/* 分页控件 */}
      <div className="flex items-center gap-2">
        {/* 上一页 */}
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1}
          className="flex items-center gap-1 px-3 py-2 border border-light-border dark:border-dark-border rounded-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary 
                     transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">上一页</span>
        </button>

        {/* 页码 */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span 
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-light-text-secondary dark:text-dark-text-secondary"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  page === current_page
                    ? 'bg-light-accent dark:bg-dark-accent text-white'
                    : 'text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary border border-light-border dark:border-dark-border'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* 下一页 */}
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page >= last_page}
          className="flex items-center gap-1 px-3 py-2 border border-light-border dark:border-dark-border rounded-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary 
                     transition-colors"
        >
          <span className="hidden sm:inline">下一页</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 快速跳转 */}
        {showQuickJump && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              跳转到
            </span>
            <input
              type="number"
              min="1"
              max={last_page}
              placeholder={current_page.toString()}
              onKeyDown={handleQuickJump}
              className="w-16 px-2 py-1 text-center border border-light-border dark:border-dark-border
                       rounded bg-light-bg dark:bg-dark-bg
                       text-light-text dark:text-dark-text text-sm
                       focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            />
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              页
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
