// API 请求封装
// 客户端请求通过 nginx 反代，自动加上 /api 前缀

const CLIENT_API_PREFIX = '/api';

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${CLIENT_API_PREFIX}${endpoint}`;

  // 判断是否是 FormData（文件上传）
  const isFormData = options.body instanceof FormData;

  const config: RequestInit = {
    ...options,
    headers: {
      // FormData 时不设置 Content-Type，让浏览器自动设置
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      'Accept': 'application/json',
      ...options.headers,
    },
    credentials: 'same-origin', // 同域名自动携带 cookie
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

      // 处理认证错误 (401/403)
      if (response.status === 401 || response.status === 403) {
        const errorMessage = errorData.message || 'Unauthenticated.';

        // 清除本地认证状态
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-storage');
          console.log('Authentication failed, cleared user storage');
          window.location.href = '/login';
        }

        throw new Error(errorMessage);
      }

      // 处理422验证错误
      if (response.status === 422 && errorData.errors) {
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
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

// GET 请求
export function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

// POST 请求
export function post<T>(
  endpoint: string,
  data?: any,
): Promise<T> {
  // 如果是 FormData，直接传递；否则 JSON.stringify
  const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);

  return request<T>(
    endpoint,
    {
      method: 'POST',
      body,
    },
  );
}

// PUT 请求
export function put<T>(
  endpoint: string,
  data?: any,
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    },
  );
}

// DELETE 请求
export function del<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' });
}

// DELETE 请求（带请求体）
export function delWithBody<T>(
  endpoint: string,
  data?: any,
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
  );
}

// PATCH 请求
export function patch<T>(
  endpoint: string,
  data?: any,
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    },
  );
}
