// 章节上传服务

import { getAuthToken } from '@/lib/api';
import { API_CONFIG } from '@/config/api';
import type {
  NovelChapter,
  ChapterUploadRequest,
  BatchUploadResponse,
} from '@/types/novel';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * 章节上传服务类
 */
export class ChapterUploadService {
  /**
   * 创建请求头（用于文件上传）
   */
  private static createUploadHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 注意：不要设置 Content-Type，让浏览器自动设置 multipart/form-data
    return headers;
  }

  /**
   * 单个章节上传
   */
  static async uploadChapter(
    novelId: number,
    chapterData: ChapterUploadRequest
  ): Promise<NovelChapter> {
    const formData = new FormData();
    formData.append('title', chapterData.title);
    formData.append('file', chapterData.file);
    
    if (chapterData.is_vip !== undefined) {
      formData.append('is_vip', chapterData.is_vip.toString());
    }
    if (chapterData.is_active !== undefined) {
      formData.append('is_active', chapterData.is_active.toString());
    }
    if (chapterData.chapter_number !== undefined) {
      formData.append('chapter_number', chapterData.chapter_number.toString());
    }

    const url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.NOVELS.CHAPTER_UPLOAD(novelId)}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.createUploadHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Chapter upload failed:', error);
      throw error;
    }
  }

  /**
   * 批量章节上传
   */
  static async batchUploadChapters(
    novelId: number,
    files: File[]
  ): Promise<BatchUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file);
    });

    const url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.NOVELS.CHAPTER_BATCH_UPLOAD(novelId)}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.createUploadHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Batch upload failed:', error);
      throw error;
    }
  }

  /**
   * 从temp目录导入章节
   */
  static async importFromTemp(novelId: number): Promise<BatchUploadResponse> {
    const url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.NOVELS.CHAPTER_IMPORT_TEMP(novelId)}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.createUploadHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Import from temp failed:', error);
      throw error;
    }
  }
}

// 导出便捷方法
export const {
  uploadChapter,
  batchUploadChapters,
  importFromTemp,
} = ChapterUploadService;
