import { redirect, notFound } from 'next/navigation';
import ChapterReader from '@/components/novel/chapter/ChapterReader';
import { serverGet, getServerUser } from '@/lib/auth-server';
import type { Novel, NovelChapter } from '@/types/novel';

interface ChapterPageProps {
  params: Promise<{
    id: string;
    chapterId: string;
  }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  // 服务端认证检查
  const user = await getServerUser();
  if (!user) {
    redirect('/login');
  }

  const { id, chapterId } = await params;
  const novelId = parseInt(id);
  const chapterIdNum = parseInt(chapterId);

  if (isNaN(novelId) || isNaN(chapterIdNum)) {
    notFound();
  }

  // 服务端获取数据
  let novel: Novel | null = null;
  let chapterData: any = null;

  try {
    // 获取小说信息和章节内容
    const [novelResponse, chapterResponse] = await Promise.all([
      serverGet<{ novel: Novel }>(`/novels/${novelId}`),
      serverGet(`/novels/${novelId}/chapters/${chapterIdNum}`)
    ]);

    novel = novelResponse.novel;
    chapterData = chapterResponse;
  } catch (error) {
    console.error('Failed to fetch chapter data:', error);
    notFound();
  }

  if (!novel || !chapterData) {
    notFound();
  }

  // 创建章节对象
  const chapter: NovelChapter = {
    id: chapterIdNum,
    novel_id: novelId,
    title: chapterData.chapter_info?.title || `第${chapterIdNum}章`,
    chapter_number: chapterData.chapter_info?.chapter_number || chapterIdNum,
    word_count: chapterData.word_count || 0,
    word_count_formatted: `${chapterData.word_count || 0}字`,
    view_count: chapterData.view_count || 0,
    is_vip: chapterData.chapter_info?.is_vip || false,
    is_active: true,
    created_at: chapterData.chapter_info?.created_at || new Date().toISOString(),
    updated_at: chapterData.chapter_info?.updated_at || new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <ChapterReader novel={novel} chapter={chapter} />
    </div>
  );
}
