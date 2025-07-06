import { get, post, put, patch, del, delWithBody } from '@/lib/api';
import { ApiResponse } from '@/types/user';
import {
  AdminNovel,
  AdminUser,
  AdminCategory,
  AdminTag,
  AdminStats,
  AdminNovelListResponse,
  AdminUserListResponse,
  AdminCategoryListResponse,
  AdminTagListResponse,
  AdminNovelQuery,
  AdminUserQuery,
  AdminCategoryQuery,
  AdminTagQuery,
  CreateNovelData,
  UpdateNovelData,
  CreateCategoryData,
  UpdateCategoryData,
  CreateTagData,
  UpdateTagData,
  AssignPermissionsData
} from '@/types/admin';

const ADMIN_BASE_URL = '/admin';

/**
 * 管理员API服务
 */
export class AdminService {
  // ==================== 小说管理 ====================
  
  /**
   * 获取所有小说列表
   */
  static async getNovels(query: AdminNovelQuery = {}): Promise<AdminNovelListResponse> {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const url = `${ADMIN_BASE_URL}/novels${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await get<AdminNovelListResponse>(url);
    return response;
  }

  /**
   * 获取小说详情
   */
  static async getNovel(id: number): Promise<AdminNovel> {
    const response = await get<AdminNovel>(`${ADMIN_BASE_URL}/novels/${id}`);
    return response;
  }

  /**
   * 创建小说
   */
  static async createNovel(data: CreateNovelData): Promise<AdminNovel> {
    const response = await post<AdminNovel>(`${ADMIN_BASE_URL}/novels`, data);
    return response;
  }

  /**
   * 更新小说
   */
  static async updateNovel(id: number, data: UpdateNovelData): Promise<AdminNovel> {
    const response = await put<AdminNovel>(`${ADMIN_BASE_URL}/novels/${id}`, data);
    return response;
  }

  /**
   * 删除小说
   */
  static async deleteNovel(id: number): Promise<void> {
    await del(`${ADMIN_BASE_URL}/novels/${id}`);
  }

  /**
   * 切换小说启用状态
   */
  static async toggleNovelStatus(id: number): Promise<AdminNovel> {
    const response = await patch<{ novel: AdminNovel }>(`${ADMIN_BASE_URL}/novels/${id}/toggle-status`);
    return response.novel;
  }

  /**
   * 切换小说推荐状态
   */
  static async toggleNovelRecommend(id: number): Promise<AdminNovel> {
    const response = await patch<{ novel: AdminNovel }>(`${ADMIN_BASE_URL}/novels/${id}/toggle-recommend`);
    return response.novel;
  }

  // ==================== 用户管理 ====================

  /**
   * 获取用户列表
   */
  static async getUsers(query: AdminUserQuery = {}): Promise<AdminUserListResponse> {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const url = `${ADMIN_BASE_URL}/users${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await get<AdminUserListResponse>(url);
    return response;
  }

  /**
   * 切换用户状态
   */
  static async toggleUserStatus(id: number): Promise<AdminUser> {
    const response = await patch<{ user: AdminUser }>(`${ADMIN_BASE_URL}/users/${id}/toggle-status`);
    return response.user;
  }

  /**
   * 分配权限
   */
  static async assignPermissions(id: number, data: AssignPermissionsData): Promise<void> {
    await post(`${ADMIN_BASE_URL}/users/${id}/assign-permissions`, data);
  }

  /**
   * 撤销权限
   */
  static async revokePermissions(id: number, data: AssignPermissionsData): Promise<void> {
    await delWithBody(`${ADMIN_BASE_URL}/users/${id}/revoke-permissions`, data);
  }

  // ==================== 分类管理 ====================

  /**
   * 获取分类列表
   */
  static async getCategories(query: AdminCategoryQuery = {}): Promise<AdminCategoryListResponse> {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const url = `${ADMIN_BASE_URL}/categories${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await get<AdminCategoryListResponse>(url);
    return response;
  }

  /**
   * 获取分类详情
   */
  static async getCategory(id: number): Promise<AdminCategory> {
    const response = await get<AdminCategory>(`${ADMIN_BASE_URL}/categories/${id}`);
    return response;
  }

  /**
   * 创建分类
   */
  static async createCategory(data: CreateCategoryData): Promise<AdminCategory> {
    const response = await post<{ message: string; category: AdminCategory }>(`${ADMIN_BASE_URL}/categories`, data);
    return response.category;
  }

  /**
   * 更新分类
   */
  static async updateCategory(id: number, data: UpdateCategoryData): Promise<AdminCategory> {
    const response = await put<{ message: string; category: AdminCategory }>(`${ADMIN_BASE_URL}/categories/${id}`, data);
    return response.category;
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: number): Promise<void> {
    await del(`${ADMIN_BASE_URL}/categories/${id}`);
  }

  // ==================== 标签管理 ====================

  /**
   * 获取标签列表
   */
  static async getTags(query: AdminTagQuery = {}): Promise<AdminTagListResponse> {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const url = `${ADMIN_BASE_URL}/tags${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await get<AdminTagListResponse>(url);
    return response;
  }

  /**
   * 获取标签详情
   */
  static async getTag(id: number): Promise<AdminTag> {
    const response = await get<AdminTag>(`${ADMIN_BASE_URL}/tags/${id}`);
    return response;
  }

  /**
   * 创建标签
   */
  static async createTag(data: CreateTagData): Promise<AdminTag> {
    const response = await post<{ message: string; tag: AdminTag }>(`${ADMIN_BASE_URL}/tags`, data);
    return response.tag;
  }

  /**
   * 更新标签
   */
  static async updateTag(id: number, data: UpdateTagData): Promise<AdminTag> {
    const response = await put<{ message: string; tag: AdminTag }>(`${ADMIN_BASE_URL}/tags/${id}`, data);
    return response.tag;
  }

  /**
   * 删除标签
   */
  static async deleteTag(id: number): Promise<void> {
    await del(`${ADMIN_BASE_URL}/tags/${id}`);
  }

  // ==================== 系统统计 ====================

  /**
   * 获取系统统计数据
   */
  static async getStats(): Promise<AdminStats> {
    const response = await get<AdminStats>(`${ADMIN_BASE_URL}/stats`);
    return response;
  }
}

// 导出便捷方法
export const {
  getNovels,
  getNovel,
  createNovel,
  updateNovel,
  deleteNovel,
  toggleNovelStatus,
  toggleNovelRecommend,
  getUsers,
  toggleUserStatus,
  assignPermissions,
  revokePermissions,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  getStats
} = AdminService;
