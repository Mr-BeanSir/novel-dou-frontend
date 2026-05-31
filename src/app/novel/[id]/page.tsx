import { notFound } from 'next/navigation';
import NovelDetail from '@/components/novel/detail/NovelDetail';
import { serverGet } from '@/lib/auth-server';
import { API_CONFIG } from '@/config/api';
import type { Novel } from '@/types/novel';

export const dynamic = 'force-dynamic';

interface NovelPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NovelPage({ params }: NovelPageProps) {
  const { id } = await params;
  const novelId = parseInt(id);
  if (isNaN(novelId)) {
    notFound();
  }

  // 服务端获取小说详情
  let novel: Novel | null = null;
  try {
    const response = await serverGet<{ novel: Novel }>(API_CONFIG.ENDPOINTS.NOVELS.DETAIL(novelId));
    novel = response.novel;
  } catch (error) {
    console.error('Failed to fetch novel:', error);
    notFound();
  }

  if (!novel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <NovelDetail novel={novel} />
    </div>
  );
}
