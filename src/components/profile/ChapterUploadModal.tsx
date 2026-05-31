'use client';

import { useState, useRef } from 'react';
import { Novel, BatchUploadResult } from '@/types/novel';
import { batchUploadChapters } from '@/services/chapter-upload';

interface ChapterUploadModalProps {
  novel: Novel;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChapterUploadModal({ novel, onClose, onSuccess }: ChapterUploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<BatchUploadResult[]>([]);

  const batchFileInputRef = useRef<HTMLInputElement>(null);

  const handleBatchUpload = async () => {
    if (batchFiles.length === 0) {
      setError('请选择要上传的文件');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadResults([]);

      const response = await batchUploadChapters(novel.id, batchFiles);
      setUploadResults(response.data.results);

      if (response.data.summary.failed === 0) {
        setSuccess(`批量上传成功！共上传 ${response.data.summary.success} 个章节`);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(`部分上传失败：成功 ${response.data.summary.success} 个，失败 ${response.data.summary.failed} 个`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '批量上传失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setBatchFiles(selectedFiles);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
              批量上传章节 - {novel.title}
            </h2>
            <button
              onClick={onClose}
              className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text"
            >
              ✕
            </button>
          </div>

          {/* 批量上传 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                选择多个文件 *
              </label>
              <input
                ref={batchFileInputRef}
                type="file"
                multiple
                accept=".txt"
                onChange={handleBatchFileChange}
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
              />
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                只支持 .txt 格式，每个文件最大 10MB，最多 50 个文件
              </p>
            </div>

            {batchFiles.length > 0 && (
              <div>
                <p className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  已选择 {batchFiles.length} 个文件：
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {batchFiles.map((file, index) => (
                    <div key={index} className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleBatchUpload}
                disabled={loading || batchFiles.length === 0}
                className="px-6 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '上传中...' : '批量上传'}
              </button>
            </div>
          </div>

          {/* 上传结果 */}
          {uploadResults.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-light-text dark:text-dark-text mb-3">上传结果：</h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {uploadResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      result.success
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className={`font-medium ${
                      result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      {result.success ? '✓' : '✗'} {result.title}
                    </div>
                    {result.error && (
                      <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 错误和成功提示 */}
          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
