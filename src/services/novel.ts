// 小说相关服务

import { get, post, del } from '@/lib/api';
import { buildQueryString } from '@/helpers/utils';
import { API_CONFIG } from '@/config/api';
import type {
  Novel,
  NovelCategory,
  NovelTag,
  NovelChapter,
  NovelBookmark,
  NovelRating,
  NovelRatingStatistics,
  ReadingHistory,
  ReadingStatistics,
  RatingHistory,
  ChapterContentResponse,
  ApiResponse,
  PaginatedResponse,
  NovelListParams,
  RankingParams,
  CategoryListParams,
  TagListParams,
  TagStatisticsResponse,
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
    const response = await get<{ novels: Novel[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.LIST}${queryString}`);

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
    const response = await get<{ novel: Novel }>(API_CONFIG.ENDPOINTS.NOVELS.DETAIL(id));
    return response.novel;
  }

  /**
   * 获取推荐小说
   */
  static async getRecommendedNovels(perPage: number = 10): Promise<Novel[]> {
    const queryString = buildQueryString({ per_page: perPage });
    const response = await get<{ novels: Novel[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.RECOMMENDED}${queryString}`);
    return response.novels;
  }

  /**
   * 获取热门小说
   */
  static async getPopularNovels(perPage: number = 10): Promise<Novel[]> {
    const queryString = buildQueryString({ per_page: perPage });
    const response = await get<{ novels: Novel[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.POPULAR}${queryString}`);
    return response.novels;
  }

  /**
   * 获取最近更新
   */
  static async getRecentNovels(perPage: number = 10): Promise<Novel[]> {
    const queryString = buildQueryString({ per_page: perPage });
    const response = await get<{ novels: Novel[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.RECENT}${queryString}`);
    return response.novels;
  }

  /**
   * 获取排行榜
   */
  static async getRankingNovels(params: RankingParams): Promise<Novel[]> {
    const queryString = buildQueryString(params);
    const response = await get<{ novels: Novel[]; pagination?: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.RANKING}${queryString}`);
    return response.novels || response as any;
  }

  /**
   * 获取分类列表（不分页）
   */
  static async getCategories(): Promise<NovelCategory[]> {
    const response = await get<{ categories: NovelCategory[] }>(API_CONFIG.ENDPOINTS.NOVELS.CATEGORIES);
    return response.categories;
  }

  /**
   * 获取分类列表（分页）
   */
  static async getCategoriesPaginated(params: CategoryListParams = {}): Promise<PaginatedResponse<NovelCategory>> {
    const queryString = buildQueryString(params);
    const response = await get<{ categories: NovelCategory[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.CATEGORIES_LIST}${queryString}`);

    // 转换为标准的分页响应格式
    return {
      data: response.categories,
      current_page: response.pagination.current_page,
      last_page: response.pagination.last_page,
      per_page: response.pagination.per_page,
      total: response.pagination.total,
      from: response.pagination.from,
      to: response.pagination.to,
    };
  }

  /**
   * 获取标签列表（不分页）
   */
  static async getTags(): Promise<NovelTag[]> {
    const response = await get<{ tags: NovelTag[]; pagination?: any }>(API_CONFIG.ENDPOINTS.NOVELS.TAGS);
    return response.tags;
  }

  /**
   * 获取标签列表（分页）
   */
  static async getTagsPaginated(params: TagListParams = {}): Promise<PaginatedResponse<NovelTag>> {
    const queryString = buildQueryString(params);
    const response = await get<{ tags: NovelTag[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.TAGS_LIST}${queryString}`);

    // 转换为标准的分页响应格式
    return {
      data: response.tags,
      current_page: response.pagination.current_page,
      last_page: response.pagination.last_page,
      per_page: response.pagination.per_page,
      total: response.pagination.total,
      from: response.pagination.from,
      to: response.pagination.to,
    };
  }

  /**
   * 获取标签统计信息
   */
  static async getTagsStatistics(): Promise<TagStatisticsResponse> {
    const response = await get<TagStatisticsResponse>(API_CONFIG.ENDPOINTS.NOVELS.TAGS_STATISTICS);
    return response;
  }

  /**
   * 获取小说章节列表
   */
  static async getNovelChapters(
    novelId: number,
    page: number = 1,
    perPage: number = 50
  ): Promise<PaginatedResponse<NovelChapter>> {
    const queryString = buildQueryString({ page, per_page: perPage });
    const response = await get<{
      chapters: NovelChapter[];
      pagination: any;
      novel: { id: number; title: string; author: string; }
    }>(`${API_CONFIG.ENDPOINTS.NOVELS.CHAPTERS(novelId)}${queryString}`);

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
   * 获取章节内容（需要认证）
   */
  static async getChapterContent(novelId: number, chapterId: number): Promise<ChapterContentResponse> {
    const response = await get<ChapterContentResponse>(API_CONFIG.ENDPOINTS.NOVELS.CHAPTER_CONTENT(novelId, chapterId));
    return response;
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
    const response = await get<{
      bookmarks: NovelBookmark[];
      pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
      };
    }>(`${API_CONFIG.ENDPOINTS.NOVELS.BOOKMARKS}${queryString}`);

    // 转换为标准的分页响应格式
    return {
      data: response.bookmarks,
      current_page: response.pagination.current_page,
      last_page: response.pagination.last_page,
      per_page: response.pagination.per_page,
      total: response.pagination.total,
      from: response.pagination.from,
      to: response.pagination.to,
    };
  }

  /**
   * 提交/更新评分
   */
  static async submitRating(novelId: number, rating: number, review?: string): Promise<NovelRating> {
    const response = await post<{ rating: NovelRating }>(API_CONFIG.ENDPOINTS.NOVELS.RATING(novelId), { rating, review });
    return response.rating;
  }

  /**
   * 获取用户评分
   */
  static async getUserRating(novelId: number): Promise<NovelRating | null> {
    try {
      const response = await get<{ rating: NovelRating | null }>(API_CONFIG.ENDPOINTS.NOVELS.USER_RATING(novelId));
      return response.rating;
    } catch (error) {
      // 如果用户未评分，返回null
      return null;
    }
  }

  /**
   * 删除评分
   */
  static async deleteRating(novelId: number): Promise<void> {
    await del(API_CONFIG.ENDPOINTS.NOVELS.RATING(novelId));
  }

  /**
   * 获取评分列表
   */
  static async getRatings(
    novelId: number,
    page: number = 1,
    perPage: number = 15,
    withReview?: boolean,
    rating?: number
  ): Promise<PaginatedResponse<NovelRating>> {
    const params: any = { per_page: perPage };
    if (withReview !== undefined) params.with_review = withReview;
    if (rating !== undefined) params.rating = rating;

    const queryString = buildQueryString(params);
    const response = await get<{ ratings: NovelRating[]; pagination: any }>(`${API_CONFIG.ENDPOINTS.NOVELS.RATINGS(novelId)}${queryString}`);

    return {
      data: response.ratings,
      current_page: response.pagination.current_page,
      last_page: response.pagination.last_page,
      per_page: response.pagination.per_page,
      total: response.pagination.total,
      from: response.pagination.from,
      to: response.pagination.to,
    };
  }

  /**
   * 获取评分统计
   */
  static async getRatingStatistics(novelId: number): Promise<NovelRatingStatistics> {
    const response = await get<{ statistics: NovelRatingStatistics }>(API_CONFIG.ENDPOINTS.NOVELS.RATING_STATISTICS(novelId));
    return response.statistics;
  }



  /**
   * 获取阅读历史
   */
  static async getReadingHistory(page: number = 1, perPage: number = 15): Promise<PaginatedResponse<ReadingHistory>> {
    const queryString = buildQueryString({ page, per_page: perPage });
    const response = await get<{
      history: ReadingHistory[];
      pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
      };
    }>(`${API_CONFIG.ENDPOINTS.NOVELS.READING_HISTORY}${queryString}`);

    // 转换为标准的分页响应格式
    return {
      data: response.history,
      current_page: response.pagination.current_page,
      last_page: response.pagination.last_page,
      per_page: response.pagination.per_page,
      total: response.pagination.total,
      from: response.pagination.from,
      to: response.pagination.to,
    };
  }

  /**
   * 清除阅读历史
   */
  static async clearReadingHistory(): Promise<void> {
    await del(API_CONFIG.ENDPOINTS.NOVELS.READING_HISTORY);
  }

  /**
   * 获取阅读统计
   */
  static async getReadingStatistics(): Promise<ReadingStatistics> {
    const response = await get<{ reading_statistics: ReadingStatistics['reading_statistics']; rating_statistics: ReadingStatistics['rating_statistics'] }>(
      API_CONFIG.ENDPOINTS.NOVELS.READING_STATISTICS
    );
    return {
      reading_statistics: response.reading_statistics,
      rating_statistics: response.rating_statistics,
    };
  }

  /**
   * 获取评价历史
   */
  static async getRatingHistory(
    page: number = 1,
    perPage: number = 15,
    params: {
      rating?: number;
      date_from?: string;
      date_to?: string;
      with_review?: boolean;
    } = {}
  ): Promise<PaginatedResponse<RatingHistory>> {
    const queryString = buildQueryString({ page, per_page: perPage, ...params });
    const response = await get<{ ratings: RatingHistory[]; pagination: any }>(
      `${API_CONFIG.ENDPOINTS.NOVELS.RATING_HISTORY}${queryString}`
    );

    return {
      data: response.ratings,
      current_page: response.pagination.current_page,
      last_page: response.pagination.last_page,
      per_page: response.pagination.per_page,
      total: response.pagination.total,
      from: response.pagination.from,
      to: response.pagination.to,
    };
  }

  /**
   * 更新阅读时长
   */
  static async updateReadingDuration(
    novelId: number,
    chapterId: number,
    duration: number
  ): Promise<{ message: string; total_duration: number; total_duration_formatted: string }> {
    const response = await post<{ message: string; total_duration: number; total_duration_formatted: string }>(
      API_CONFIG.ENDPOINTS.NOVELS.READING_DURATION,
      {
        novel_id: novelId,
        chapter_id: chapterId,
        duration: duration,
      }
    );
    return response;
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
  getCategoriesPaginated,
  getTags,
  getTagsPaginated,
  getTagsStatistics,
  getNovelChapters,
  getChapterContent,
  bookmarkNovel,
  unbookmarkNovel,
  getBookmarks,
  getReadingHistory,
  clearReadingHistory,
  getReadingStatistics,
  getRatingHistory,
  updateReadingDuration,
} = NovelService;
