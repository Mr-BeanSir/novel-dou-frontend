import { redirect, notFound } from 'next/navigation';
import NovelDetail from '@/components/novel/detail/NovelDetail';
import { serverGet, getServerUser } from '@/lib/auth-server';
import type { Novel } from '@/types/novel';

interface NovelPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NovelPage({ params }: NovelPageProps) {
  // 服务端认证检查
  const user = await getServerUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const novelId = parseInt(id);
  if (isNaN(novelId)) {
    notFound();
  }

  // 服务端获取小说详情
  let novel: Novel | null = null;
  try {
    const response = await serverGet<{ novel: Novel }>(`/novels/${novelId}`);
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
