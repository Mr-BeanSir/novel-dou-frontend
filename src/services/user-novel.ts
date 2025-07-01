// 用户小说管理服务

import { get, post, put, patch } from '@/lib/api';
import { buildQueryString } from '@/helpers/utils';
import { API_CONFIG } from '@/config/api';
import type {
  Novel,
  NovelCategory,
  NovelTag,
  CreateNovelRequest,
  UpdateNovelRequest,
  UserNovelListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/novel';

/**
 * 用户小说管理服务类
 */
export class UserNovelService {
  /**
   * 创建新小说
   */
  static async createNovel(novelData: CreateNovelRequest): Promise<Novel> {
    const response = await post<{ message: string; novel: Novel }>(
      API_CONFIG.ENDPOINTS.NOVELS.CREATE,
      novelData
    );
    return response.novel;
  }

  /**
   * 更新小说信息
   */
  static async updateNovel(novelId: number, novelData: UpdateNovelRequest): Promise<Novel> {
    const response = await put<{ message: string; novel: Novel }>(
      API_CONFIG.ENDPOINTS.NOVELS.UPDATE(novelId),
      novelData
    );
    return response.novel;
  }

  /**
   * 获取用户创建的小说列表
   */
  static async getUserNovels(params: UserNovelListParams = {}): Promise<PaginatedResponse<Novel>> {
    const queryString = buildQueryString(params);
    const response = await get<{ novels: Novel[]; pagination: any }>(
      `${API_CONFIG.ENDPOINTS.USER.NOVELS}${queryString}`
    );

    // 转换为标准的分页响应格式
    return {
      data: response.novels,
      current_page: response.pagination.current_page,
      last_page: response.pagination.last_page,
      per_page: response.pagination.per_page,
      total: response.pagination.total,
      from: response.pagination.from,
      to: response.pagination.to,
    };
  }

  /**
   * 获取分类列表（用于创建小说时选择）
   */
  static async getCategories(): Promise<NovelCategory[]> {
    const response = await get<{ categories: NovelCategory[] }>(
      API_CONFIG.ENDPOINTS.NOVELS.CATEGORIES,
      false
    );
    return response.categories;
  }

  /**
   * 获取标签列表（用于创建小说时选择）
   */
  static async getTags(): Promise<NovelTag[]> {
    const response = await get<{ tags: NovelTag[]; pagination?: any }>(
      API_CONFIG.ENDPOINTS.NOVELS.TAGS,
      false
    );
    return response.tags;
  }
}

// 导出便捷方法
export const {
  createNovel,
  updateNovel,
  getUserNovels,
  getCategories,
  getTags,
} = UserNovelService;
