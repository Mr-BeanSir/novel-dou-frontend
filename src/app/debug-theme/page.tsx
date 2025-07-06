'use client';

import { useState, useEffect } from 'react';

export default function DebugThemePage() {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    setMounted(true);
    // 检查当前主题
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      setCurrentTheme('dark');
    } else {
      setCurrentTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (htmlElement.classList.contains('dark')) {
      // 切换到亮色
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
      bodyElement.classList.remove('dark');
      bodyElement.classList.add('light');
      setCurrentTheme('light');
      localStorage.setItem('theme', 'light');
    } else {
      // 切换到暗色
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
      bodyElement.classList.remove('light');
      bodyElement.classList.add('dark');
      setCurrentTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
    
    console.log('Theme toggled to:', currentTheme === 'light' ? 'dark' : 'light');
    console.log('HTML classes:', htmlElement.className);
    console.log('Body classes:', bodyElement.className);
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: 'var(--light-bg)',
      color: 'var(--light-text)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          主题调试页面
        </h1>
        
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1rem', 
          backgroundColor: 'var(--light-bg-secondary)',
          border: '1px solid var(--light-border)',
          borderRadius: '8px'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>当前状态</h2>
          <p>当前主题: {currentTheme}</p>
          <p>HTML 类: {typeof window !== 'undefined' ? document.documentElement.className : 'N/A'}</p>
          <p>Body 类: {typeof window !== 'undefined' ? document.body.className : 'N/A'}</p>
        </div>

        <button
          onClick={toggleTheme}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--light-accent)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '2rem'
          }}
        >
          切换主题 (当前: {currentTheme})
        </button>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--light-bg-secondary)',
            border: '1px solid var(--light-border)',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--light-text)' }}>
              文本测试
            </h3>
            <p style={{ color: 'var(--light-text)', marginBottom: '0.5rem' }}>
              主要文本颜色
            </p>
            <p style={{ color: 'var(--light-text-secondary)', marginBottom: '0.5rem' }}>
              次要文本颜色
            </p>
            <p style={{ color: 'var(--light-accent)' }}>
              强调色文本
            </p>
          </div>

          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--light-bg-secondary)',
            border: '1px solid var(--light-border)',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--light-text)' }}>
              按钮测试
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--light-accent)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                主要按钮
              </button>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: 'var(--light-text)',
                border: '1px solid var(--light-border)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                次要按钮
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
