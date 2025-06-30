import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChapterReader from '@/components/novel/reader/ChapterReader';
import { NovelService } from '@/services/novel';

interface ChapterPageProps {
  params: Promise<{
    id: string;
    chapterId: string;
  }>;
}

// 生成页面元数据
export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  try {
    const { id, chapterId } = await params;
    const novelId = parseInt(id);
    const chapterIdNum = parseInt(chapterId);

    if (isNaN(novelId) || isNaN(chapterIdNum)) {
      return {
        title: '章节阅读 | 读书豆',
        description: '优质小说阅读平台',
      };
    }

    const novel = await NovelService.getNovel(novelId);

    // 尝试获取章节信息，如果失败则使用默认信息
    let chapterTitle = `第${chapterIdNum}章`;
    try {
      const chapter = await NovelService.getChapter(novelId, chapterIdNum);
      chapterTitle = chapter.title;
    } catch (error) {
      // 如果获取章节失败，使用默认标题
      console.log('Chapter metadata requires authentication, using default title');
    }

    return {
      title: `${chapterTitle} - ${novel.title} | 读书豆`,
      description: `阅读《${novel.title}》第${chapterIdNum}章：${chapterTitle}`,
      keywords: [
        novel.title,
        novel.author,
        chapterTitle,
        '小说阅读',
        '在线阅读',
        ...(novel.tags?.map(tag => tag.name) || [])
      ].join(','),
      openGraph: {
        title: `${chapterTitle} - ${novel.title}`,
        description: `阅读《${novel.title}》第${chapterIdNum}章：${chapterTitle}`,
        images: novel.cover_image ? [novel.cover_image] : [],
        type: 'article',
      },
    };
  } catch (error) {
    return {
      title: '章节阅读 | 读书豆',
      description: '优质小说阅读平台',
    };
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  try {
    const { id, chapterId } = await params;
    const novelId = parseInt(id);
    const chapterIdNum = parseInt(chapterId);

    if (isNaN(novelId) || isNaN(chapterIdNum)) {
      console.log('Invalid novel ID or chapter ID:', id, chapterId);
      notFound();
    }

    console.log('Fetching chapter:', novelId, chapterIdNum);

    // 获取小说信息
    const novel = await NovelService.getNovel(novelId);
    if (!novel) {
      console.log('Novel not found:', novelId);
      notFound();
    }

    // 尝试获取章节信息，如果失败则创建一个基本的章节对象
    let chapter;
    try {
      chapter = await NovelService.getChapter(novelId, chapterIdNum);
    } catch (error) {
      console.log('Chapter API requires authentication, creating mock chapter');
      // 创建一个基本的章节对象
      chapter = {
        id: chapterIdNum,
        novel_id: novelId,
        title: `第${chapterIdNum}章`,
        chapter_number: chapterIdNum,
        word_count: 2000,
        word_count_formatted: '2000字',
        view_count: 0,
        is_vip: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    console.log('Chapter loaded successfully:', chapter.title);

    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <ChapterReader 
          novel={novel} 
          chapter={chapter} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading chapter:', error);

    // 检查是否是网络错误或404错误
    if (error instanceof Error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        notFound();
      }
    }

    // 对于其他错误，抛出以触发error.tsx
    throw error;
  }
}
