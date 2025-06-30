'use client';

import { useEffect, useRef } from 'react';
import { Novel, NovelChapter } from '@/types/novel';
import { ReaderSettings } from './ChapterReader';

interface ReaderContentProps {
  content: string;
  settings: ReaderSettings;
  novel: Novel;
  chapter: NovelChapter;
}

export default function ReaderContent({ 
  content, 
  settings, 
  novel, 
  chapter 
}: ReaderContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // 格式化内容，将换行符转换为段落
  const formatContent = (text: string): string[] => {
    return text
      .split(/\n+/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0);
  };

  // 获取字体类名
  const getFontClass = (fontFamily: string): string => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'sans':
        return 'font-sans';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans'; // 默认改为黑体
    }
  };

  // 获取字体宽度类名
  const getFontWeightClass = (fontWeight: string): string => {
    switch (fontWeight) {
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      default:
        return 'font-normal';
    }
  };

  // 获取主题样式
  const getThemeStyles = () => {
    switch (settings.theme) {
      case 'sepia':
        return {
          backgroundColor: '#fef8e7',
          color: '#4b3f2f',
        };
      case 'dark':
        return {
          backgroundColor: '#1a1a1a',
          color: '#eae3cc',
        };
      default:
        return {
          backgroundColor: '#fef8e7',
          color: '#4b3f2f',
        };
    }
  };

  const paragraphs = formatContent(content);
  const themeStyles = getThemeStyles();

  return (
    <main className="py-8">
      <div 
        className="mx-auto px-4"
        style={{ maxWidth: `${settings.maxWidth}px` }}
      >
        {/* 章节标题 */}
        <div className="text-center mb-8">
          <h1 
            className="font-bold mb-2"
            style={{ 
              fontSize: `${Math.max(settings.fontSize + 6, 20)}px`,
              lineHeight: settings.lineHeight,
              color: themeStyles.color
            }}
          >
            第{chapter.chapter_number}章 {chapter.title}
          </h1>
          <div className="text-sm opacity-75 space-x-4">
            <span>{novel.title}</span>
            <span>·</span>
            <span>{novel.author}</span>
            <span>·</span>
            <span>{chapter.word_count_formatted}</span>
          </div>
        </div>

        {/* 章节内容 */}
        <div
          ref={contentRef}
          className={`${getFontClass(settings.fontFamily)} ${getFontWeightClass(settings.fontWeight)} leading-relaxed`}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            color: themeStyles.color,
          }}
        >
          {paragraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className="mb-6 text-justify"
              style={{ 
                textIndent: '2em',
                wordBreak: 'break-word',
                hyphens: 'auto',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* 章节信息 */}
        <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border">
          <div className="text-center text-sm opacity-75 space-y-2">
            <div>
              本章字数：{chapter.word_count_formatted} | 
              阅读次数：{chapter.view_count.toLocaleString()}
            </div>
            <div>
              更新时间：{new Date(chapter.updated_at).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
