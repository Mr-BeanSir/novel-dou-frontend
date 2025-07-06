// 管理员相关类型定义

export interface AdminNovel {
  id: number;
  title: string;
  author: string;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  description: string;
  cover_image?: string;
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
  status: 'draft' | 'published' | 'completed' | 'paused';
  word_count_level: 'short' | 'medium' | 'long';
  word_count: number;
  chapter_count: number;
  view_count: number;
  like_count: number;
  rating: number;
  is_vip: boolean;
  is_active: boolean;
  is_recommended: boolean;
  tags?: Array<{
    id: number;
    name: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  is_active: boolean;
  user_group_id: number;
  user_group?: {
    id: number;
    name: string;
    description?: string;
  };
  permissions?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  novel_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  description?: string;
  novel_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminTag {
  id: number;
  name: string;
  description?: string;
  novel_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total_novels: number;
  total_users: number;
  total_categories: number;
  total_tags: number;
  active_novels: number;
  active_users: number;
  recommended_novels: number;
  vip_novels: number;
  recent_novels: AdminNovel[];
  recent_users: AdminUser[];
}

export interface AdminPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface AdminNovelListResponse {
  novels: AdminNovel[];
  pagination: AdminPagination;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  pagination: AdminPagination;
}

export interface AdminCategoryListResponse {
  categories: AdminCategory[];
  pagination: AdminPagination;
}

export interface AdminTagListResponse {
  tags: AdminTag[];
  pagination: AdminPagination;
}

// 查询参数类型
export interface AdminNovelQuery {
  search?: string;
  category_id?: number;
  status?: string;
  is_active?: boolean;
  is_recommended?: boolean;
  is_vip?: boolean;
  user_id?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface AdminUserQuery {
  search?: string;
  is_active?: boolean;
  user_group_id?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface AdminCategoryQuery {
  search?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface AdminTagQuery {
  search?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// 创建/更新参数类型
export interface CreateNovelData {
  title: string;
  author: string;
  user_id: number;
  description: string;
  cover_image?: string;
  category_id: number;
  status: string;
  word_count_level: string;
  is_vip: boolean;
  is_active: boolean;
  is_recommended: boolean;
  tag_ids: number[];
  meta_data?: Record<string, any>;
}

export interface UpdateNovelData extends Partial<CreateNovelData> {}

export interface CreateCategoryData {
  name: string;
  description?: string;
  is_active: boolean;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CreateTagData {
  name: string;
  description?: string;
  is_active: boolean;
}

export interface UpdateTagData extends Partial<CreateTagData> {}

export interface AssignPermissionsData {
  permission_ids: number[];
}
