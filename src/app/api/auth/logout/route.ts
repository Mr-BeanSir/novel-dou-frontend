// 登出API路由

import { NextRequest, NextResponse } from 'next/server';
import { deleteAuthCookie, getAuthCookie } from '@/lib/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    // 如果有token，调用后端登出API
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/users/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        // 即使后端登出失败，也要删除本地cookie
        console.error('Backend logout failed:', error);
      }
    }

    // 删除cookie
    await deleteAuthCookie();

    return NextResponse.json({
      message: '登出成功'
    });

  } catch (error) {
    console.error('Logout API error:', error);
    // 即使出错也要删除cookie
    await deleteAuthCookie();
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
