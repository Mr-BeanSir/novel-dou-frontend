// API 请求封装

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// 获取存储的 token - 从 Zustand store 获取
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // 从 Zustand 持久化存储中获取
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

// 设置 token - 不再直接操作 localStorage，由 Zustand 管理
export function setAuthToken(token: string): void {
  // 这个函数保留为兼容性，但实际由 Zustand store 管理
  console.warn('setAuthToken is deprecated, use Zustand store instead');
}

// 清除 token - 不再直接操作 localStorage，由 Zustand 管理
export function clearAuthToken(): void {
  // 这个函数保留为兼容性，但实际由 Zustand store 管理
  console.warn('clearAuthToken is deprecated, use Zustand store instead');
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
