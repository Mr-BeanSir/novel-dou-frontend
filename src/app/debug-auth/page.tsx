'use client';

import { useState, useEffect } from 'react';
import { getAuthToken } from '@/lib/api';
import { getCurrentUserLatest } from '@/services/auth';

export default function DebugAuth() {
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 检查localStorage
        const userStorage = localStorage.getItem('user-storage');
        const token = getAuthToken();
        
        let userInfo = null;
        let apiError = null;
        
        // 尝试调用API
        try {
          userInfo = await getCurrentUserLatest();
        } catch (error) {
          apiError = error instanceof Error ? error.message : String(error);
        }

        setAuthInfo({
          localStorage: userStorage ? JSON.parse(userStorage) : null,
          token,
          userInfo,
          apiError,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        setAuthInfo({
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">认证状态调试</h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <pre className="text-sm overflow-auto">
          {JSON.stringify(authInfo, null, 2)}
        </pre>
      </div>

      <div className="mt-6 space-y-4">
        <button
          onClick={() => {
            localStorage.removeItem('user-storage');
            window.location.reload();
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          清除认证信息
        </button>
        
        <button
          onClick={() => {
            window.location.href = '/login';
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
        >
          前往登录
        </button>
      </div>
    </div>
  );
}
