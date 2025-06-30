// API 配置文件

export const API_CONFIG = {
  // 基础 URL
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',

  // 超时设置
  TIMEOUT: 30000,

  // 重试配置
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // 认证相关
  AUTH: {
    TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_HEADER: 'Authorization',
    TOKEN_PREFIX: 'Bearer',
  },

  // 端点配置
  ENDPOINTS: {
    // 用户相关
    AUTH: {
      LOGIN: '/users/login',
      REGISTER: '/users/register',
      LOGOUT: '/users/logout',
      REFRESH: '/users/refresh',
      PROFILE: '/users/profile',
    },

    // 小说相关
    NOVELS: {
      LIST: '/novels',
      DETAIL: (id: number) => `/novels/${id}`,
      RECOMMENDED: '/novels/recommended',
      POPULAR: '/novels/popular',
      RECENT: '/novels/recent',
      RANKING: '/novels/ranking',
      CATEGORIES: '/novels/categories/all',
      BOOKMARK: (id: number) => `/novels/${id}/bookmark`,
      BOOKMARKS: '/novels/bookmarks',
      RATING: (id: number) => `/novels/${id}/rating`,
      USER_RATING: (id: number) => `/novels/${id}/rating/user`,
      RATINGS: (id: number) => `/novels/${id}/ratings`,
      RATING_STATISTICS: (id: number) => `/novels/${id}/ratings/statistics`,
      COMMENTS: (id: number) => `/novels/${id}/comments`,
      CHAPTERS: (id: number) => `/novels/${id}/chapters`,
      CHAPTER_CONTENT: (novelId: number, chapterId: number) => `/novels/${novelId}/chapters/${chapterId}`,
      READING_HISTORY: '/novels/reading-history',
    },
  },
} as const;

export type ApiConfig = typeof API_CONFIG;
