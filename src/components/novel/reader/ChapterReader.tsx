'use client';

import { useState, useEffect } from 'react';
import { Novel, NovelChapter, ChapterContentResponse } from '@/types/novel';
import { NovelService } from '@/services/novel';
import ReaderHeader from './ReaderHeader';
import ReaderContent from './ReaderContent';
import ChapterNavigation from './ChapterNavigation';
import ReaderControls from './ReaderControls';

interface ChapterReaderProps {
  novel: Novel;
  chapter: NovelChapter;
}

export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: 'serif' | 'sans' | 'mono';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  theme: 'light' | 'dark' | 'sepia';
  maxWidth: number;
}

export default function ChapterReader({ novel, chapter }: ChapterReaderProps) {
  const [chapterContent, setChapterContent] = useState<ChapterContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [chapters, setChapters] = useState<NovelChapter[]>([]);
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 18,
    lineHeight: 1.6,
    fontFamily: 'sans',
    fontWeight: 'normal',
    theme: 'light',
    maxWidth: 800,
  });

  console.log('ChapterReader component mounted', { novel: novel.title, chapter: chapter.title });

  // 加载章节内容
  useEffect(() => {
    console.log('useEffect triggered for chapter content loading');
    const loadChapterContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Loading chapter content for:', novel.id, chapter.id);

        const chapterContentResponse = await NovelService.getChapterContent(novel.id, chapter.id);
        setChapterContent(chapterContentResponse);
      } catch (err) {
        console.error('Failed to load chapter content:', err);
        if (err instanceof Error && err.message.includes('401')) {
          setError('请先登录后再阅读章节内容');
        } else {
          // 提供一个示例内容，让用户能够体验阅读器功能
          const mockChapterContent: ChapterContentResponse = {
            content: `这是《${novel.title}》的${chapter.title}的示例内容。

由于当前无法连接到后端服务器或需要登录认证，这里显示的是模拟内容，用于展示阅读器的功能。

在真实的应用中，这里会显示从服务器获取的章节内容。阅读器支持以下功能：

1. 字体大小调节 - 可以通过设置按钮调整字体大小
2. 行间距设置 - 提供多种行间距选项
3. 字体类型切换 - 支持宋体、黑体、等宽字体
4. 主题切换 - 支持亮色、暗色、护眼模式
5. 阅读宽度调节 - 可以调整文本显示宽度

这个阅读器采用了现代化的设计，注重阅读体验，支持响应式布局，在移动设备和桌面设备上都能良好显示。

章节导航功能让您可以轻松地在不同章节之间切换，同时保持阅读设置的持久化。

感谢您使用读书豆小说阅读平台！`,
            word_count: 0,
            view_count: 0,
            created_at: "2025-06-30T11:53:47.000000Z",
            updated_at: "2025-06-30T13:41:49.000000Z",
            chapter_info: {
              id: chapter.id,
              title: chapter.title.replace(/^第\d+章\s*/, ''), // 移除"第x章"前缀
              chapter_number: chapter.chapter_number,
              is_vip: chapter.is_vip,
              view_count: 156,
              created_at: "2025-06-30T11:53:47.000000Z",
              updated_at: "2025-06-30T13:41:49.000000Z",
            },
            novel: {
              id: novel.id,
              title: novel.title,
              author: novel.author,
            },
          };
          setChapterContent(mockChapterContent);
          setError(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadChapterContent();
  }, [novel.id, chapter.id, novel.title, chapter.title]);

  // 由于没有章节列表接口，创建基本的章节列表用于导航
  useEffect(() => {
    const mockChapters: NovelChapter[] = [];
    for (let i = 1; i <= novel.chapter_count; i++) {
      mockChapters.push({
        id: chapter.id - chapter.chapter_number + i,
        novel_id: novel.id,
        title: `第${i}章`,
        chapter_number: i,
        word_count: 2000,
        word_count_formatted: '2000字',
        view_count: 0,
        is_vip: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    setChapters(mockChapters);
  }, [novel.chapter_count, chapter.id, chapter.chapter_number]);

  // 从localStorage加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('reader-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error('Failed to parse saved settings:', err);
      }
    }
  }, []);

  // 保存设置到localStorage
  useEffect(() => {
    localStorage.setItem('reader-settings', JSON.stringify(settings));
  }, [settings]);

  // 更新设置
  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // 获取当前章节在列表中的索引
  const currentChapterIndex = chapters.findIndex(ch => ch.id === chapter.id);
  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c49e65] mx-auto mb-4"></div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              正在加载章节内容...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#c49e65] hover:bg-[#a9744f] text-white rounded-md transition-colors duration-200"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      settings.theme === 'sepia' 
        ? 'bg-[#fef8e7] text-[#4b3f2f]' 
        : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text'
    }`}>
      {/* 阅读器头部 */}
      <ReaderHeader
        novel={novel}
        chapter={chapter}
        onToggleControls={() => setShowControls(!showControls)}
        showControls={showControls}
      />

      {/* 阅读器控制面板 */}
      {showControls && (
        <ReaderControls
          settings={settings}
          onSettingsChange={updateSettings}
          onClose={() => setShowControls(false)}
        />
      )}

      {/* 章节内容 */}
      <ReaderContent
        chapterContent={chapterContent}
        settings={settings}
        novel={novel}
        chapter={chapter}
      />

      {/* 章节导航 */}
      <ChapterNavigation
        novel={novel}
        currentChapter={chapter}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        chapterContent={chapterContent}
      />
    </div>
  );
}
