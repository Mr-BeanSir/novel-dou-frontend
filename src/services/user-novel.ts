// 用户小说管理服务

import { get, post, put, patch, del } from '@/lib/api';
import { buildQueryString } from '@/helpers/utils';
import { API_CONFIG } from '@/config/api';
import type {
  Novel,
  NovelCategory,
  NovelTag,
  NovelChapter,
  CreateNovelRequest,
  UpdateNovelRequest,
  UserNovelListParams,
  ChapterUploadRequest,
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
      API_CONFIG.ENDPOINTS.USER.CREATE,
      novelData
    );
    return response.novel;
  }

  /**
   * 更新小说信息
   */
  static async updateNovel(novelId: number, novelData: UpdateNovelRequest): Promise<Novel> {
    const response = await put<{ message: string; novel: Novel }>(
      API_CONFIG.ENDPOINTS.USER.NOVEL_UPDATE(novelId),
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
   * 获取用户小说详情
   */
  static async getUserNovelDetail(novelId: number): Promise<Novel> {
    const response = await get<{ novel: Novel }>(API_CONFIG.ENDPOINTS.USER.NOVEL_DETAIL(novelId));
    return response.novel;
  }

  /**
   * 获取用户小说章节列表
   */
  static async getUserNovelChapters(
    novelId: number,
    params: {
      is_active?: boolean;
      sort_by?: 'chapter_number' | 'created_at' | 'updated_at' | 'title' | 'word_count';
      sort_order?: 'asc' | 'desc';
      per_page?: number;
      page?: number;
    } = {}
  ): Promise<PaginatedResponse<NovelChapter>> {
    const queryString = buildQueryString(params);
    const response = await get<{ chapters: NovelChapter[]; pagination: any }>(
      `${API_CONFIG.ENDPOINTS.USER.NOVEL_CHAPTERS(novelId)}${queryString}`
    );

    return {
      data: response.chapters,
      current_page: response.pagination.current_page,
      last_page: response.pagination.last_page,
      per_page: response.pagination.per_page,
      total: response.pagination.total,
      from: response.pagination.from,
      to: response.pagination.to,
    };
  }

  /**
   * 获取章节内容
   */
  static async getChapterContent(novelId: number, chapterId: number): Promise<{
    chapter: {
      id: number;
      title: string;
      chapter_number: number;
      word_count: number;
      is_vip: boolean;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    content: string;
  }> {
    const response = await get<{
      chapter: {
        id: number;
        title: string;
        chapter_number: number;
        word_count: number;
        is_vip: boolean;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      };
      content: string;
    }>(API_CONFIG.ENDPOINTS.USER.CHAPTER_CONTENT(novelId, chapterId));
    return response;
  }

  /**
   * 发布新章节（文本形式）
   */
  static async publishChapter(novelId: number, chapterData: {
    title: string;
    content: string;
    chapter_number?: number;
    is_vip?: boolean;
    is_active?: boolean;
  }): Promise<NovelChapter> {
    const response = await post<{ message: string; chapter: NovelChapter }>(
      API_CONFIG.ENDPOINTS.USER.CHAPTER_TEXT_CREATE(novelId),
      chapterData
    );
    return response.chapter;
  }

  /**
   * 更新章节
   */
  static async updateChapter(novelId: number, chapterId: number, chapterData: {
    title?: string;
    content?: string;
    chapter_number?: number;
    is_vip?: boolean;
    is_active?: boolean;
  }): Promise<NovelChapter> {
    const response = await put<{ message: string; chapter: NovelChapter }>(
      API_CONFIG.ENDPOINTS.USER.CHAPTER_UPDATE(novelId, chapterId),
      chapterData
    );
    return response.chapter;
  }

  /**
   * 删除章节
   */
  static async deleteChapter(novelId: number, chapterId: number): Promise<void> {
    await del(API_CONFIG.ENDPOINTS.USER.CHAPTER_DELETE(novelId, chapterId));
  }

  /**
   * 更新小说状态
   */
  static async updateNovelStatus(novelId: number, status: string): Promise<Novel> {
    const response = await patch<{ message: string; novel: Novel }>(
      API_CONFIG.ENDPOINTS.USER.NOVEL_STATUS(novelId),
      { status }
    );
    return response.novel;
  }
}

// 导出便捷方法
export const {
  createNovel,
  updateNovel,
  getUserNovels,
  getUserNovelDetail,
  getUserNovelChapters,
  getChapterContent,
  publishChapter,
  updateChapter,
  deleteChapter,
  updateNovelStatus,
} = UserNovelService;
