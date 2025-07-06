// 章节内容API路由

import { NextRequest, NextResponse } from 'next/server';
import { serverGet } from '@/lib/auth-server';

interface RouteParams {
  params: Promise<{
    id: string;
    chapterId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, chapterId } = await params;
    const novelId = parseInt(id);
    const chapterIdNum = parseInt(chapterId);

    if (isNaN(novelId) || isNaN(chapterIdNum)) {
      return NextResponse.json(
        { error: '无效的小说ID或章节ID' },
        { status: 400 }
      );
    }

    // 服务端获取章节内容
    const response = await serverGet(`/novels/${novelId}/chapters/${chapterIdNum}`);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Chapter content API error:', error);
    return NextResponse.json(
      { error: '获取章节内容失败' },
      { status: 500 }
    );
  }
}
