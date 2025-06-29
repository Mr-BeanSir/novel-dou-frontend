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
  comment_count: number;
  rating: string;
  rating_count: number;
  last_chapter_at?: string;
  is_vip: boolean;
  is_finished: boolean;
  is_recommended: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NovelChapter {
  id: number;
  novel_id: number;
  title: string;
  chapter_number: number;
  content?: string;
  content_file_path?: string;
  word_count: number;
  is_vip: boolean;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NovelBookmark {
  id: number;
  user_id: number;
  novel_id: number;
  novel?: Novel;
  last_read_chapter_id?: number;
  last_read_chapter?: NovelChapter;
  reading_progress: number;
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
  user_id: number;
  novel_id: number;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface ReadingHistory {
  id: number;
  user_id: number;
  novel_id: number;
  chapter_id: number;
  novel?: Novel;
  chapter?: NovelChapter;
  reading_duration: number;
  created_at: string;
  updated_at: string;
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
