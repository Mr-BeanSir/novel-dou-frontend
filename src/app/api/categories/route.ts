// 分类API路由

import { NextRequest, NextResponse } from 'next/server';
import { serverGet } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    // 服务端获取分类数据
    const response = await serverGet<{ categories: any[] }>('/novels/categories/all');
    
    return NextResponse.json({
      categories: response.categories
    });

  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 }
    );
  }
}
