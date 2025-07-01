'use client';

import { useState, useRef } from 'react';
import { Novel, BatchUploadResult } from '@/types/novel';
import { uploadChapter, batchUploadChapters, importFromTemp } from '@/services/chapter-upload';

interface ChapterUploadModalProps {
  novel: Novel;
  onClose: () => void;
  onSuccess: () => void;
}

type UploadMode = 'single' | 'batch' | 'temp';

export function ChapterUploadModal({ novel, onClose, onSuccess }: ChapterUploadModalProps) {
  const [mode, setMode] = useState<UploadMode>('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 单个上传状态
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isVip, setIsVip] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [chapterNumber, setChapterNumber] = useState<number | undefined>();
  
  // 批量上传状态
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<BatchUploadResult[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  const handleSingleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('请输入章节标题');
      return;
    }
    
    if (!file) {
      setError('请选择要上传的文件');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await uploadChapter(novel.id, {
        title: title.trim(),
        file,
        is_vip: isVip,
        is_active: isActive,
        chapter_number: chapterNumber,
      });
      
      setSuccess('章节上传成功！');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setLoading(false);
    }
  };

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

  const handleTempImport = async () => {
    try {
      setLoading(true);
      setError(null);
      setUploadResults([]);
      
      const response = await importFromTemp(novel.id);
      setUploadResults(response.data.results);
      
      if (response.data.summary.failed === 0) {
        setSuccess(`从temp目录导入成功！共导入 ${response.data.summary.success} 个章节`);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(`部分导入失败：成功 ${response.data.summary.success} 个，失败 ${response.data.summary.failed} 个`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '从temp目录导入失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // 自动从文件名提取章节标题
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
        setTitle(fileName);
      }
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
              上传章节 - {novel.title}
            </h2>
            <button
              onClick={onClose}
              className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text"
            >
              ✕
            </button>
          </div>

          {/* 上传模式选择 */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setMode('single')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'single'
                  ? 'bg-wood-primary text-white'
                  : 'bg-light-hover dark:bg-dark-hover text-light-text dark:text-dark-text'
              }`}
            >
              单个上传
            </button>
            <button
              onClick={() => setMode('batch')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'batch'
                  ? 'bg-wood-primary text-white'
                  : 'bg-light-hover dark:bg-dark-hover text-light-text dark:text-dark-text'
              }`}
            >
              批量上传
            </button>
            <button
              onClick={() => setMode('temp')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'temp'
                  ? 'bg-wood-primary text-white'
                  : 'bg-light-hover dark:bg-dark-hover text-light-text dark:text-dark-text'
              }`}
            >
              从temp导入
            </button>
          </div>

          {/* 单个上传 */}
          {mode === 'single' && (
            <form onSubmit={handleSingleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  章节标题 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                  placeholder="请输入章节标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  章节文件 *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                />
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                  支持 .txt, .doc, .docx 格式，最大 10MB
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  章节序号（可选）
                </label>
                <input
                  type="number"
                  min="1"
                  value={chapterNumber || ''}
                  onChange={(e) => setChapterNumber(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                  placeholder="留空则自动分配"
                />
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isVip}
                    onChange={(e) => setIsVip(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-light-text dark:text-dark-text">VIP章节</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-light-text dark:text-dark-text">启用</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-wood-primary text-white rounded-lg hover:bg-wood-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '上传中...' : '上传章节'}
                </button>
              </div>
            </form>
          )}

          {/* 批量上传 */}
          {mode === 'batch' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  选择多个文件 *
                </label>
                <input
                  ref={batchFileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.doc,.docx"
                  onChange={handleBatchFileChange}
                  className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-wood-primary"
                />
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                  支持 .txt, .doc, .docx 格式，每个文件最大 10MB
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
                  className="px-6 py-2 bg-wood-primary text-white rounded-lg hover:bg-wood-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '上传中...' : '批量上传'}
                </button>
              </div>
            </div>
          )}

          {/* 从temp导入 */}
          {mode === 'temp' && (
            <div className="space-y-4">
              <div className="bg-light-hover dark:bg-dark-hover rounded-lg p-4">
                <h3 className="font-medium text-light-text dark:text-dark-text mb-2">
                  从temp目录导入章节
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  此功能将从服务器的temp目录中导入所有可用的章节文件。
                  请确保您已经将章节文件上传到了服务器的temp目录中。
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleTempImport}
                  disabled={loading}
                  className="px-6 py-2 bg-wood-primary text-white rounded-lg hover:bg-wood-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '导入中...' : '开始导入'}
                </button>
              </div>
            </div>
          )}

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
