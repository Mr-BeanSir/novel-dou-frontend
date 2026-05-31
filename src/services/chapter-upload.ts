// 章节上传服务

import { post } from '@/lib/api';
import { API_CONFIG } from '@/config/api';
import type { BatchUploadResponse } from '@/types/novel';

/**
 * 章节上传服务类
 */
export class ChapterUploadService {
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

    return post<BatchUploadResponse>(
      API_CONFIG.ENDPOINTS.USER.CHAPTER_BATCH_UPLOAD(novelId),
      formData
    );
  }
}

// 导出便捷方法
export const {
  batchUploadChapters,
} = ChapterUploadService;
