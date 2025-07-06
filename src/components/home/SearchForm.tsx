'use client';

import { useState } from 'react';

export default function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: 实现搜索功能
      console.log('搜索:', searchQuery);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          placeholder="搜索小说、作者、关键词..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-theme-border
                   bg-theme-card text-theme-text placeholder-theme-text-secondary
                   focus:border-theme-accent focus:outline-none focus:ring-4 focus:ring-theme-accent/20
                   transition-all duration-300 shadow-lg group-hover:shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2
                   px-6 py-2 bg-theme-accent text-theme-bg rounded-xl
                   hover:bg-theme-accent-hover transition-theme
                   font-medium shadow-md hover:shadow-lg"
        >
          搜索
        </button>
      </form>
    </div>
  );
}
