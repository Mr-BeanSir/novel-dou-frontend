// 标签API路由

import { NextRequest, NextResponse } from 'next/server';
import { serverGet } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    // 服务端获取标签数据
    const response = await serverGet<{ tags: any[] }>('/novels/tags/all');
    
    return NextResponse.json({
      tags: response.tags
    });

  } catch (error) {
    console.error('Tags API error:', error);
    return NextResponse.json(
      { error: '获取标签失败' },
      { status: 500 }
    );
  }
}
