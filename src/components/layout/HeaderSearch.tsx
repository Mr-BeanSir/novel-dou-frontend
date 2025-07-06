'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeaderSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/novels?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsExpanded(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    // 延迟收缩，避免点击搜索按钮时输入框过早收缩
    setTimeout(() => {
      if (!searchQuery.trim()) {
        setIsExpanded(false);
      }
    }, 200);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className={`flex items-center transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-10'
      }`}>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="搜索小说、作者..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full h-10 pl-10 pr-4 bg-light-bg-secondary dark:bg-dark-bg-secondary
                       border border-light-border dark:border-dark-border rounded-lg
                       text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary
                       focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                       transition-all duration-300 ${
                         isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                       }`}
          />
          <button
            type="submit"
            className={`absolute left-0 top-0 h-10 w-10 flex items-center justify-center
                       text-light-text-secondary dark:text-dark-text-secondary
                       hover:text-light-accent dark:hover:text-dark-accent
                       transition-colors duration-200 ${
                         !isExpanded ? 'bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg' : ''
                       }`}
            onClick={!isExpanded ? handleFocus : undefined}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
