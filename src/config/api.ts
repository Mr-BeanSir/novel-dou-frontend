// API 配置文件
// 所有端点通过 nginx 反代，/api/* 统一转发到后端

export const API_CONFIG = {
  // 超时设置
  TIMEOUT: 30000,

  // 重试配置
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // 端点配置（所有路径以 /api 开头，nginx 代理到后端）
  ENDPOINTS: {
    // 用户认证相关
    AUTH: {
      LOGIN: '/api/users/login',
      REGISTER: '/api/users/register',
      LOGOUT: '/api/users/logout',
      REFRESH: '/api/users/refresh',
      PROFILE: '/api/users/profile',
      ME: '/api/users/me',
    },

    // 小说相关
    NOVELS: {
      LIST: '/api/novels',
      DETAIL: (id: number) => `/api/novels/${id}`,
      RECOMMENDED: '/api/novels/recommended',
      POPULAR: '/api/novels/popular',
      RECENT: '/api/novels/recent',
      RANKING: '/api/novels/ranking',
      CATEGORIES: '/api/novels/categories/all',
      CATEGORIES_LIST: '/api/novels/categories',
      CATEGORIES_STATISTICS: '/api/novels/categories/statistics',
      TAGS: '/api/novels/tags/all',
      TAGS_LIST: '/api/novels/tags',
      TAGS_STATISTICS: '/api/novels/tags/statistics',
      BOOKMARK: (id: number) => `/api/novels/${id}/bookmark`,
      BOOKMARKS: '/api/novels/bookmarks',
      RATING: (id: number) => `/api/novels/${id}/rating`,
      USER_RATING: (id: number) => `/api/novels/${id}/rating/user`,
      RATINGS: (id: number) => `/api/novels/${id}/ratings`,
      RATING_STATISTICS: (id: number) => `/api/novels/${id}/ratings/statistics`,
      CHAPTERS: (id: number) => `/api/novels/${id}/chapters`,
      CHAPTER_CONTENT: (novelId: number, chapterId: number) => `/api/novels/${novelId}/chapters/${chapterId}`,
      CHAPTER_UPLOAD: (novelId: number) => `/api/novels/${novelId}/chapters/upload`,
      CHAPTER_BATCH_UPLOAD: (novelId: number) => `/api/novels/${novelId}/chapters/batch-upload`,
      CHAPTER_IMPORT_TEMP: (novelId: number) => `/api/novels/${novelId}/chapters/import-from-temp`,
      READING_HISTORY: '/api/novels/reading-history',
      READING_STATISTICS: '/api/novels/reading-statistics',
      RATING_HISTORY: '/api/novels/rating-history',
      READING_DURATION: '/api/novels/reading-duration',
    },

    // 用户小说管理相关
    USER: {
      NOVELS: '/api/users/novels',
      CREATE: '/api/users/novels',
      NOVEL_DETAIL: (id: number) => `/api/users/novels/${id}`,
      NOVEL_UPDATE: (id: number) => `/api/users/novels/${id}`,
      NOVEL_STATUS: (id: number) => `/api/users/novels/${id}/status`,
      NOVEL_CHAPTERS: (id: number) => `/api/users/novels/${id}/chapters`,
      CHAPTER_DETAIL: (novelId: number, chapterId: number) => `/api/users/novels/${novelId}/chapters/${chapterId}`,
      CHAPTER_CONTENT: (novelId: number, chapterId: number) => `/api/users/novels/${novelId}/chapters/${chapterId}/content`,
      CHAPTER_TEXT_CREATE: (novelId: number) => `/api/users/novels/${novelId}/chapters/text`,
      CHAPTER_UPDATE: (novelId: number, chapterId: number) => `/api/users/novels/${novelId}/chapters/${chapterId}`,
      CHAPTER_DELETE: (novelId: number, chapterId: number) => `/api/users/novels/${novelId}/chapters/${chapterId}`,
    },
  },
} as const;

export type ApiConfig = typeof API_CONFIG;
