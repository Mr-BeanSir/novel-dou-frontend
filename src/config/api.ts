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
      LOGIN: '/users/login',
      REGISTER: '/users/register',
      LOGOUT: '/users/logout',
      REFRESH: '/users/refresh',
      PROFILE: '/users/profile',
      ME: '/users/me',
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
      CATEGORIES_LIST: '/novels/categories',
      CATEGORIES_STATISTICS: '/novels/categories/statistics',
      TAGS: '/novels/tags/all',
      TAGS_LIST: '/novels/tags',
      TAGS_STATISTICS: '/novels/tags/statistics',
      BOOKMARK: (id: number) => `/novels/${id}/bookmark`,
      BOOKMARKS: '/novels/bookmarks',
      RATING: (id: number) => `/novels/${id}/rating`,
      USER_RATING: (id: number) => `/novels/${id}/rating/user`,
      RATINGS: (id: number) => `/novels/${id}/ratings`,
      RATING_STATISTICS: (id: number) => `/novels/${id}/ratings/statistics`,
      CHAPTERS: (id: number) => `/novels/${id}/chapters`,
      CHAPTER_CONTENT: (novelId: number, chapterId: number) => `/novels/${novelId}/chapters/${chapterId}`,
      CHAPTER_UPLOAD: (novelId: number) => `/novels/${novelId}/chapters/upload`,
      CHAPTER_BATCH_UPLOAD: (novelId: number) => `/novels/${novelId}/chapters/batch-upload`,
      CHAPTER_IMPORT_TEMP: (novelId: number) => `/novels/${novelId}/chapters/import-from-temp`,
      READING_HISTORY: '/novels/reading-history',
      READING_STATISTICS: '/novels/reading-statistics',
      RATING_HISTORY: '/novels/rating-history',
      READING_DURATION: '/novels/reading-duration',
    },

    // 用户小说管理相关
    USER: {
      NOVELS: '/users/novels',
      CREATE: '/users/novels',
      NOVEL_DETAIL: (id: number) => `/users/novels/${id}`,
      NOVEL_UPDATE: (id: number) => `/users/novels/${id}`,
      NOVEL_STATUS: (id: number) => `/users/novels/${id}/status`,
      NOVEL_CHAPTERS: (id: number) => `/users/novels/${id}/chapters`,
      CHAPTER_DETAIL: (novelId: number, chapterId: number) => `/users/novels/${novelId}/chapters/${chapterId}`,
      CHAPTER_CONTENT: (novelId: number, chapterId: number) => `/users/novels/${novelId}/chapters/${chapterId}/content`,
      CHAPTER_TEXT_CREATE: (novelId: number) => `/users/novels/${novelId}/chapters/text`,
      CHAPTER_UPDATE: (novelId: number, chapterId: number) => `/users/novels/${novelId}/chapters/${chapterId}`,
      CHAPTER_DELETE: (novelId: number, chapterId: number) => `/users/novels/${novelId}/chapters/${chapterId}`,
    },
  },
} as const;

export type ApiConfig = typeof API_CONFIG;
