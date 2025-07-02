// 用户相关类型定义

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  user_group_id: number;
  user_group?: UserGroup;
  is_active: boolean;
  avatar?: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

export interface UserGroup {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  users_count?: number;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

// 认证相关类型
export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_group_id?: number;
}

export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
  token_type?: string;
  expires_at?: string;
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
export interface UserListParams {
  page?: number;
  per_page?: number;
  search?: string;
  user_group_id?: number;
  is_active?: boolean;
}

export interface UserGroupListParams {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}

export interface PermissionListParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Toast 通知相关类型
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
