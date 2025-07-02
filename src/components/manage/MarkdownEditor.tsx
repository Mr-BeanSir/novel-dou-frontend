'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Eye, 
  EyeOff,
  Type,
  Minus
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "开始写作...",
  height = "500px"
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 计算字数（去除markdown语法）
    const plainText = value
      .replace(/[#*_`~\[\]()]/g, '') // 移除markdown符号
      .replace(/\s+/g, ' ') // 合并空白字符
      .trim();
    setWordCount(plainText.length);
  }, [value]);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // 重新设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = value.split('\n');
    let currentPos = 0;
    let lineIndex = 0;

    // 找到当前行
    for (let i = 0; i < lines.length; i++) {
      if (currentPos + lines[i].length >= start) {
        lineIndex = i;
        break;
      }
      currentPos += lines[i].length + 1; // +1 for \n
    }

    // 在当前行开头插入前缀
    lines[lineIndex] = prefix + lines[lineIndex];
    const newText = lines.join('\n');
    onChange(newText);

    // 重新设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      title: '粗体',
      action: () => insertText('**', '**')
    },
    {
      icon: Italic,
      title: '斜体',
      action: () => insertText('*', '*')
    },
    {
      icon: Underline,
      title: '下划线',
      action: () => insertText('<u>', '</u>')
    },
    {
      icon: Type,
      title: '标题',
      action: () => insertAtLineStart('# ')
    },
    {
      icon: Quote,
      title: '引用',
      action: () => insertAtLineStart('> ')
    },
    {
      icon: List,
      title: '无序列表',
      action: () => insertAtLineStart('- ')
    },
    {
      icon: ListOrdered,
      title: '有序列表',
      action: () => insertAtLineStart('1. ')
    },
    {
      icon: Code,
      title: '代码',
      action: () => insertText('`', '`')
    },
    {
      icon: Minus,
      title: '分割线',
      action: () => insertText('\n---\n')
    }
  ];

  const renderPreview = (text: string) => {
    // 简单的markdown渲染（实际项目中建议使用专业的markdown解析库）
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^---$/gm, '<hr class="my-4 border-gray-300">')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {toolbarButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  onClick={button.action}
                  title={button.title}
                  className="p-2 hover:bg-light-bg dark:hover:bg-dark-bg rounded transition-colors"
                >
                  <Icon className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {wordCount} 字
            </span>
            
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-3 py-1 bg-light-accent/10 text-light-accent border border-light-accent/30 rounded hover:bg-light-accent/20 transition-colors"
            >
              {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? '编辑' : '预览'}
            </button>
          </div>
        </div>
      </div>

      {/* 编辑器内容 */}
      <div style={{ height }}>
        {isPreview ? (
          <div 
            className="p-4 overflow-y-auto h-full bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border-none outline-none resize-none font-mono text-sm leading-relaxed"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
          />
        )}
      </div>
    </div>
  );
}
