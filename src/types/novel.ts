// 小说相关类型定义

export interface NovelCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  novel_count: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 分类统计信息类型（用于新的统计API）
export interface CategoryStatistics {
  id: number;
  name: string;
  novel_count: number;
  last_updated_at: string;
}

// 分类统计API响应类型
export interface CategoryStatisticsResponse {
  statistics: CategoryStatistics[];
}

// 分类查询参数类型
export interface CategoryListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: 'name' | 'novel_count' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  include_inactive?: boolean;
}

// 标签查询参数类型
export interface TagListParams {
  page?: number;
  per_page?: number;
  search?: string;
  min_novels?: number;
  sort_by?: 'name' | 'novel_count' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  include_inactive?: boolean;
}

// 标签统计信息类型
export interface TagStatistics {
  total_tags: number;
  active_tags: number;
  tags_with_novels: number;
  total_novel_tag_relations: string;
  average_novels_per_tag: number;
  most_popular_tag: {
    id: number;
    name: string;
    novel_count: number;
  };
}

// 标签统计API响应类型
export interface TagStatisticsResponse {
  statistics: TagStatistics;
  last_updated_at: string;
}

export interface NovelTag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  novel_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserReadingHistory {
  id: number;
  chapter_id: number;
  chapter: {
    id: number;
    title: string;
    chapter_number: number;
  };
  reading_duration: number;
  reading_duration_formatted: string;
  read_at: string;
}

export interface Novel {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_image?: string;
  category?: NovelCategory;
  tags?: NovelTag[];
  status: 'draft' | 'serializing' | 'completed' | 'paused';
  status_text: string;
  word_count_level: string;
  word_count: number;
  word_count_formatted: string;
  chapter_count: number;
  view_count: number;
  bookmark_count: number;
  comment_count?: number;
  rating: string;
  rating_count: number;
  last_chapter_at?: string;
  is_vip: boolean;
  is_finished: boolean;
  is_recommended: boolean;
  is_active: boolean;
  latest_chapter?: NovelChapter;
  user_reading_history?: UserReadingHistory | null;
  created_at: string;
  updated_at: string;
}

export interface NovelChapter {
  id: number;
  novel_id: number;
  title: string;
  chapter_number: number;
  content?: string;
  file_path?: string;
  word_count: number;
  word_count_formatted: string;
  view_count: number;
  is_vip: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NovelBookmark {
  id: number;
  user_id: number;
  novel_id: number;
  novel?: Novel;
  last_read_chapter?: NovelChapter;
  reading_progress: number;
  last_read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NovelComment {
  id: number;
  user_id: number;
  novel_id: number;
  chapter_id?: number;
  parent_id?: number;
  content: string;
  likes_count: number;
  is_liked?: boolean;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
  replies?: NovelComment[];
  created_at: string;
  updated_at: string;
}

export interface NovelRating {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  novel_id: number;
  rating: number;
  rating_text: string;
  review?: string;
  has_review: boolean;
  created_at: string;
  updated_at: string;
}

export interface NovelRatingStatistics {
  total_ratings: number;
  average_rating: number;
  rating_distribution: {
    [key: string]: number;
  };
  reviews_count: number;
}

export interface NovelRating {
  id: number;
  user_id: number;
  novel_id: number;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface ReadingHistory {
  id: number;
  novel_id: number;
  chapter_id: number;
  novel: Novel;
  chapter: NovelChapter;
  reading_duration: number;
  reading_duration_formatted: string;
  read_at: string;
  created_at: string;
  updated_at: string;
}

// 章节内容响应类型
export interface ChapterContentResponse {
  content: string;
  word_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  chapter_info: {
    id: number;
    title: string;
    chapter_number: number;
    is_vip: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
  };
  novel: {
    id: number;
    title: string;
    author: string;
  };
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// 查询参数类型
export interface NovelListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  status?: Novel['status'];
  tag_ids?: string;
  sort_by?: 'popular' | 'recent' | 'rating' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface RankingParams {
  type: 'view' | 'bookmark' | 'rating';
  period: 'all' | 'week' | 'month';
  per_page?: number;
}

// 小说创建请求类型
export interface CreateNovelRequest {
  title: string;
  author?: string;
  description?: string;
  cover_image?: string;
  category_id: number;
  status: 'draft' | 'serializing' | 'completed' | 'paused';
  word_count_level: 'short' | 'medium' | 'long' | 'super_long';
  is_vip?: boolean;
  is_recommended?: boolean;
  is_active?: boolean;
  tag_ids?: number[];
  meta_data?: Record<string, any>;
}

// 小说更新请求类型
export interface UpdateNovelRequest extends Partial<CreateNovelRequest> {}

// 用户小说列表查询参数
export interface UserNovelListParams {
  search?: string;
  category_id?: number;
  status?: Novel['status'];
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'view_count' | 'rating' | 'last_chapter_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// 章节上传请求类型
export interface ChapterUploadRequest {
  title: string;
  file: File;
  is_vip?: boolean;
  is_active?: boolean;
  chapter_number?: number;
}

// 批量章节上传响应类型
export interface BatchUploadResult {
  success: boolean;
  chapter?: {
    id: number;
    title: string;
    chapter_number: number;
    file_path: string;
  };
  title: string;
  error?: string;
}

export interface BatchUploadResponse {
  success: boolean;
  message: string;
  data: {
    results: BatchUploadResult[];
    summary: {
      total: number;
      success: number;
      failed: number;
    };
  };
}

// 阅读统计类型
export interface ReadingStatistics {
  reading_statistics: {
    total_reading_time: number;
    total_reading_time_formatted: string;
    total_novels_read: number;
    total_chapters_read: number;
    recent_reading_time: number;
    recent_reading_time_formatted: string;
    top_categories: Array<{
      name: string;
      read_count: number;
    }>;
  };
  rating_statistics: {
    total_ratings: number;
    average_rating: number;
    reviews_count: number;
  };
}

// 评价历史类型
export interface RatingHistory {
  id: number;
  novel: {
    id: number;
    title: string;
    author: string;
    category: {
      id: number;
      name: string;
    };
  };
  rating: number;
  rating_text: string;
  review?: string;
  has_review: boolean;
  created_at: string;
  updated_at: string;
}
