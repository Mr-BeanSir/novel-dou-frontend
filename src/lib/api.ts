// API 请求封装

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// 获取存储的 token - 从 Zustand store 获取
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const userStorage = localStorage.getItem('user-storage');
    if (userStorage) {
      const parsed = JSON.parse(userStorage);
      return parsed.state?.token || null;
    }
    return null;
  } catch {
    return null;
  }
}

// 这些函数不再需要，由 Zustand store 管理
export function setAuthToken(token: string): void {
  // 由 Zustand store 管理
}

export function clearAuthToken(): void {
  // 由 Zustand store 管理
}

// 创建请求头
function createHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      ...createHeaders(includeAuth),
      ...options.headers,
    },
  };

  try {
    console.log('Making API request to:', url);
    const response = await fetch(url, config);

    if (!response.ok) {
      console.error('API request failed:', {
        url,
        status: response.status,
        statusText: response.statusText
      });

      const errorData = await response.json().catch(() => ({}));

      // 处理422验证错误
      if (response.status === 422 && errorData.errors) {
        // 提取第一个验证错误信息
        const firstError = Object.values(errorData.errors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        throw new Error(errorMessage || errorData.message || '验证失败');
      }

      // 处理其他错误
      const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API request successful:', url);
    return data;
  } catch (error) {
    console.error('API request failed:', {
      url,
      error: error instanceof Error ? error.message : error
    });
    throw error;
  }
}

// GET 请求
export function get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
  return request<T>(endpoint, { method: 'GET' }, includeAuth);
}

// POST 请求
export function post<T>(
  endpoint: string,
  data?: any,
  includeAuth: boolean = true
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    },
    includeAuth
  );
}

// PUT 请求
export function put<T>(
  endpoint: string,
  data?: any,
  includeAuth: boolean = true
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    },
    includeAuth
  );
}

// DELETE 请求
export function del<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' }, includeAuth);
}

// DELETE 请求（带请求体）
export function delWithBody<T>(
  endpoint: string,
  data?: any,
  includeAuth: boolean = true
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    },
    includeAuth
  );
}

// PATCH 请求
export function patch<T>(
  endpoint: string,
  data?: any,
  includeAuth: boolean = true
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    },
    includeAuth
  );
}

// 构建查询字符串
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
