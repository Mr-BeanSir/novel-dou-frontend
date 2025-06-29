import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NovelDetail from '@/components/NovelDetail';
import { NovelService } from '@/services/novel';

interface NovelPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 生成页面元数据
export async function generateMetadata({ params }: NovelPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const novel = await NovelService.getNovel(parseInt(id));

    return {
      title: `${novel.title} - ${novel.author} | 读书豆`,
      description: novel.description.slice(0, 160),
      keywords: [
        novel.title,
        novel.author,
        '小说',
        '在线阅读',
        ...(novel.tags?.map(tag => tag.name) || [])
      ].join(','),
      openGraph: {
        title: novel.title,
        description: novel.description,
        images: novel.cover_image ? [novel.cover_image] : [],
        type: 'article',
      },
    };
  } catch (error) {
    return {
      title: '小说详情 | 读书豆',
      description: '优质小说阅读平台',
    };
  }
}

export default async function NovelPage({ params }: NovelPageProps) {
  try {
    const { id } = await params;
    const novelId = parseInt(id);

    if (isNaN(novelId)) {
      console.log('Invalid novel ID:', id);
      notFound();
    }

    console.log('Fetching novel with ID:', novelId);

    // 获取小说详情
    const novel = await NovelService.getNovel(novelId);

    if (!novel) {
      console.log('Novel not found:', novelId);
      notFound();
    }

    console.log('Novel loaded successfully:', novel.title);

    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <NovelDetail novel={novel} />
      </div>
    );
  } catch (error) {
    console.error('Error loading novel:', error);

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
