'use client';

import { useEffect, useRef } from 'react';
import { Novel, NovelChapter, ChapterContentResponse } from '@/types/novel';
import { ReaderSettings } from './ChapterReader';

interface ReaderContentProps {
  chapterContent: ChapterContentResponse | null;
  settings: ReaderSettings;
  novel: Novel;
  chapter: NovelChapter;
}

export default function ReaderContent({
  chapterContent,
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

  // 如果没有章节内容数据，显示加载状态
  if (!chapterContent) {
    return (
      <main className="py-8">
        <div className="mx-auto px-4 text-center" style={{ maxWidth: `${settings.maxWidth}px` }}>
          <div className="text-light-text-secondary dark:text-dark-text-secondary">
            正在加载章节内容...
          </div>
        </div>
      </main>
    );
  }

  const paragraphs = formatContent(chapterContent.content);
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
            第{chapterContent.chapter_info.chapter_number}章 {chapterContent.chapter_info.title}
          </h1>
          <div className="text-sm opacity-75 space-x-4">
            <span>{chapterContent.novel.title}</span>
            <span>·</span>
            <span>{chapterContent.novel.author}</span>
            <span>·</span>
            <span>{chapterContent.word_count.toLocaleString()}字</span>
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
              本章字数：{chapterContent.word_count.toLocaleString()}字 |
              阅读次数：{chapterContent.view_count.toLocaleString()}
            </div>
            <div>
              更新时间：{new Date(chapterContent.updated_at).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
