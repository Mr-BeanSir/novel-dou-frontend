// 小说相关服务

import { get, post, del } from '@/lib/api';
import { buildQueryString } from '@/helpers/utils';
import { API_CONFIG } from '@/config/api';
import type {
  Novel,
  NovelCategory,
  NovelChapter,
  NovelBookmark,
  NovelComment,
  NovelRating,
  ReadingHistory,
  ApiResponse,
  PaginatedResponse,
  NovelListParams,
  RankingParams,
} from '@/types/novel';

/**
 * 小说服务类
 */
export class NovelService {
  /**
   * 获取小说列表
   */
  static async getNovels(params: NovelListParams = {}): Promise<PaginatedResponse<Novel>> {
    const queryString = buildQueryString(params);
    const response = await get<{ novels: Novel[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.LIST}${queryString}`, false);

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
   * 获取单部小说详情
   */
  static async getNovel(id: number): Promise<Novel> {
    const response = await get<{ novel: Novel }>(API_CONFIG.ENDPOINTS.NOVELS.DETAIL(id), false);
    return response.novel;
  }

  /**
   * 获取推荐小说
   */
  static async getRecommendedNovels(perPage: number = 10): Promise<Novel[]> {
    const queryString = buildQueryString({ per_page: perPage });
    const response = await get<{ novels: Novel[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.RECOMMENDED}${queryString}`, false);
    return response.novels;
  }

  /**
   * 获取热门小说
   */
  static async getPopularNovels(perPage: number = 10): Promise<Novel[]> {
    const queryString = buildQueryString({ per_page: perPage });
    const response = await get<{ novels: Novel[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.POPULAR}${queryString}`, false);
    return response.novels;
  }

  /**
   * 获取最近更新
   */
  static async getRecentNovels(perPage: number = 10): Promise<Novel[]> {
    const queryString = buildQueryString({ per_page: perPage });
    const response = await get<{ novels: Novel[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.RECENT}${queryString}`, false);
    return response.novels;
  }

  /**
   * 获取排行榜
   */
  static async getRankingNovels(params: RankingParams): Promise<Novel[]> {
    const queryString = buildQueryString(params);
    const response = await get<Novel[]>(`${API_CONFIG.ENDPOINTS.NOVELS.RANKING}${queryString}`, false);
    return response;
  }

  /**
   * 获取分类列表
   */
  static async getCategories(): Promise<NovelCategory[]> {
    const response = await get<{ categories: NovelCategory[] }>(API_CONFIG.ENDPOINTS.NOVELS.CATEGORIES, false);
    return response.categories;
  }

  /**
   * 获取小说章节列表
   */
  static async getNovelChapters(
    novelId: number,
    page: number = 1,
    perPage: number = 50
  ): Promise<PaginatedResponse<NovelChapter>> {
    const queryString = buildQueryString({ page, per_page: perPage, sort_order: 'asc' });
    const response = await get<{ chapters: NovelChapter[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.CHAPTERS(novelId)}${queryString}`, false);

    // 转换为标准的分页响应格式
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
   * 获取章节详情
   */
  static async getChapter(novelId: number, chapterId: number): Promise<NovelChapter> {
    const response = await get<NovelChapter>(API_CONFIG.ENDPOINTS.NOVELS.CHAPTER_DETAIL(novelId, chapterId), false);
    return response;
  }

  /**
   * 获取章节内容（需要认证）
   */
  static async getChapterContent(novelId: number, chapterId: number): Promise<string> {
    const response = await get<{ content: string }>(API_CONFIG.ENDPOINTS.NOVELS.CHAPTER_CONTENT(novelId, chapterId));
    return response.content;
  }

  /**
   * 收藏小说
   */
  static async bookmarkNovel(novelId: number): Promise<void> {
    await post(API_CONFIG.ENDPOINTS.NOVELS.BOOKMARK(novelId));
  }

  /**
   * 取消收藏
   */
  static async unbookmarkNovel(novelId: number): Promise<void> {
    await del(API_CONFIG.ENDPOINTS.NOVELS.BOOKMARK(novelId));
  }

  /**
   * 获取收藏列表
   */
  static async getBookmarks(page: number = 1, perPage: number = 15): Promise<PaginatedResponse<NovelBookmark>> {
    const queryString = buildQueryString({ page, per_page: perPage });
    const response = await get<PaginatedResponse<NovelBookmark>>(`${API_CONFIG.ENDPOINTS.NOVELS.BOOKMARKS}${queryString}`);
    return response;
  }

  /**
   * 评分小说
   */
  static async rateNovel(novelId: number, rating: number, review?: string): Promise<void> {
    await post(API_CONFIG.ENDPOINTS.NOVELS.RATING(novelId), { rating, review });
  }

  /**
   * 添加评论
   */
  static async addComment(
    novelId: number,
    content: string,
    chapterId?: number,
    parentId?: number
  ): Promise<void> {
    await post(API_CONFIG.ENDPOINTS.NOVELS.COMMENTS(novelId), {
      content,
      chapter_id: chapterId,
      parent_id: parentId,
    });
  }

  /**
   * 获取评论列表
   */
  static async getComments(
    novelId: number,
    page: number = 1,
    perPage: number = 15,
    chapterId?: number
  ): Promise<PaginatedResponse<NovelComment>> {
    const params: any = { page, per_page: perPage };
    if (chapterId) params.chapter_id = chapterId;

    const queryString = buildQueryString(params);
    const response = await get<{ comments: NovelComment[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.COMMENTS(novelId)}${queryString}`, false);

    // 转换为标准的分页响应格式
    return {
      data: response.comments,
      current_page: response.pagination.current_page,
      last_page: response.pagination.last_page,
      per_page: response.pagination.per_page,
      total: response.pagination.total,
      from: response.pagination.from,
      to: response.pagination.to,
    };
  }

  /**
   * 点赞评论
   */
  static async likeComment(commentId: number): Promise<void> {
    await post(`/novels/comments/${commentId}/like`);
  }

  /**
   * 获取阅读历史
   */
  static async getReadingHistory(page: number = 1, perPage: number = 15): Promise<PaginatedResponse<ReadingHistory>> {
    const queryString = buildQueryString({ page, per_page: perPage });
    const response = await get<PaginatedResponse<ReadingHistory>>(`${API_CONFIG.ENDPOINTS.NOVELS.READING_HISTORY}${queryString}`);
    return response;
  }

  /**
   * 清除阅读历史
   */
  static async clearReadingHistory(): Promise<void> {
    await del(API_CONFIG.ENDPOINTS.NOVELS.READING_HISTORY);
  }
}

// 导出便捷方法
export const {
  getNovels,
  getNovel,
  getRecommendedNovels,
  getPopularNovels,
  getRecentNovels,
  getRankingNovels,
  getCategories,
  getNovelChapters,
  getChapter,
  getChapterContent,
  bookmarkNovel,
  unbookmarkNovel,
  getBookmarks,
  rateNovel,
  addComment,
  getComments,
  likeComment,
  getReadingHistory,
  clearReadingHistory,
} = NovelService;
