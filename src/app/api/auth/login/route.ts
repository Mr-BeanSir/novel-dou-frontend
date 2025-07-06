// 登录API路由

import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 调用后端登录API
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || '登录失败' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 设置httpOnly cookie
    if (data.token) {
      await setAuthCookie(data.token);
    }

    // 返回用户信息（不包含token）
    return NextResponse.json({
      user: data.user,
      message: '登录成功'
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
