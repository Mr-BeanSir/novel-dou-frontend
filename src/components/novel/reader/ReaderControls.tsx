'use client';

import { X, Minus, Plus, Type, Monitor } from 'lucide-react';
import { ReaderSettings } from './ChapterReader';

interface ReaderControlsProps {
  settings: ReaderSettings;
  onSettingsChange: (settings: Partial<ReaderSettings>) => void;
  onClose: () => void;
}

export default function ReaderControls({
  settings,
  onSettingsChange,
  onClose
}: ReaderControlsProps) {
  const fontSizes = [14, 16, 18, 20, 22, 24, 26, 28];
  const lineHeights = [1.4, 1.6, 1.8, 2.0, 2.2];
  const maxWidths = [600, 720, 800, 900, 1000];
  const fontWeights = [
    { value: 'normal', label: '正常' },
    { value: 'medium', label: '中等' },
    { value: 'semibold', label: '半粗' },
    { value: 'bold', label: '粗体' },
  ] as const;

  const fontFamilies = [
    { value: 'serif', label: '宋体', className: 'font-serif' },
    { value: 'sans', label: '黑体', className: 'font-sans' },
    { value: 'mono', label: '等宽', className: 'font-mono' },
  ] as const;

  return (
    <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute top-16 left-1/2 transform -translate-x-1/2
                   bg-light-bg dark:bg-dark-bg
                   border border-light-border dark:border-dark-border
                   rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
            阅读设置
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-light-text-secondary dark:text-dark-text-secondary
                     hover:text-light-text dark:hover:text-dark-text
                     hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                     rounded-md transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 字体大小 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-light-text dark:text-dark-text flex items-center">
                <Type className="w-4 h-4 mr-2" />
                字体大小
              </label>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {settings.fontSize}px
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const currentIndex = fontSizes.indexOf(settings.fontSize);
                  if (currentIndex > 0) {
                    onSettingsChange({ fontSize: fontSizes[currentIndex - 1] });
                  }
                }}
                disabled={settings.fontSize <= fontSizes[0]}
                className="p-2 text-light-text dark:text-dark-text
                         hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                         disabled:opacity-50 disabled:cursor-not-allowed
                         rounded-md transition-colors duration-200"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1 px-2">
                <input
                  type="range"
                  min={fontSizes[0]}
                  max={fontSizes[fontSizes.length - 1]}
                  step="2"
                  value={settings.fontSize}
                  onChange={(e) => onSettingsChange({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  const currentIndex = fontSizes.indexOf(settings.fontSize);
                  if (currentIndex < fontSizes.length - 1) {
                    onSettingsChange({ fontSize: fontSizes[currentIndex + 1] });
                  }
                }}
                disabled={settings.fontSize >= fontSizes[fontSizes.length - 1]}
                className="p-2 text-light-text dark:text-dark-text
                         hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                         disabled:opacity-50 disabled:cursor-not-allowed
                         rounded-md transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 行间距 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-light-text dark:text-dark-text">
                行间距
              </label>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {settings.lineHeight}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {lineHeights.map((height) => (
                <button
                  key={height}
                  onClick={() => onSettingsChange({ lineHeight: height })}
                  className={`py-2 px-3 text-sm rounded-md transition-colors duration-200 ${
                    settings.lineHeight === height
                      ? 'bg-[#c49e65] text-white'
                      : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent'
                  }`}
                >
                  {height}
                </button>
              ))}
            </div>
          </div>

          {/* 字体类型 */}
          <div>
            <label className="text-sm font-medium text-light-text dark:text-dark-text mb-3 block">
              字体类型
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontFamilies.map((font) => (
                <button
                  key={font.value}
                  onClick={() => onSettingsChange({ fontFamily: font.value })}
                  className={`py-2 px-3 text-sm rounded-md transition-colors duration-200 ${font.className} ${
                    settings.fontFamily === font.value
                      ? 'bg-[#c49e65] text-white'
                      : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent'
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* 字体宽度 */}
          <div>
            <label className="text-sm font-medium text-light-text dark:text-dark-text mb-3 block">
              字体宽度
            </label>
            <div className="grid grid-cols-4 gap-2">
              {fontWeights.map((weight) => (
                <button
                  key={weight.value}
                  onClick={() => onSettingsChange({ fontWeight: weight.value })}
                  className={`py-2 px-3 text-sm rounded-md transition-colors duration-200 ${
                    settings.fontWeight === weight.value
                      ? 'bg-[#c49e65] text-white'
                      : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent'
                  }`}
                  style={{ fontWeight: weight.value }}
                >
                  {weight.label}
                </button>
              ))}
            </div>
          </div>

          {/* 阅读宽度 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-light-text dark:text-dark-text flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                阅读宽度
              </label>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {settings.maxWidth}px
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {maxWidths.map((width) => (
                <button
                  key={width}
                  onClick={() => onSettingsChange({ maxWidth: width })}
                  className={`py-2 px-2 text-xs rounded-md transition-colors duration-200 ${
                    settings.maxWidth === width
                      ? 'bg-[#c49e65] text-white'
                      : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent'
                  }`}
                >
                  {width}
                </button>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
