import NovelsPageContent from '@/components/novel/list/NovelsPageContent';

// 强制动态渲染，因为根布局使用了 cookies
export const dynamic = 'force-dynamic';

export default function NovelsPage() {
  return <NovelsPageContent />;
}
