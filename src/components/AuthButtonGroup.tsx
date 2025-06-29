'use client';

import { Moon } from 'lucide-react';
import { useThemeContext } from '@/providers/ThemeProvider';

interface AuthButtonGroupProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isMobile?: boolean;
}

export default function AuthButtonGroup({ onLoginClick, onRegisterClick, isMobile = false }: AuthButtonGroupProps) {
  const { toggleTheme } = useThemeContext();

  return (
    <div className={`flex items-center ${isMobile ? 'flex-col space-y-3 w-full' : 'space-x-3'}`}>
      {/* 🌙 暗黑模式切换按钮 - 淡黄色背景 */}
      <button
        onClick={toggleTheme}
        className={`p-3 rounded-md transition-colors duration-200
                   bg-[#fef8e7] hover:bg-[#f9f3d2]
                   flex items-center justify-center
                   ${isMobile ? 'w-full justify-center' : ''}`}
        aria-label="切换主题"
        title="切换主题"
      >
        <Moon className="w-5 h-5 text-[#4b3f2f]" />
        {isMobile && (
          <span className="ml-2 text-sm font-medium text-[#4b3f2f]">
            暗黑模式
          </span>
        )}
      </button>

      {/* 移动端按钮组 */}
      {isMobile ? (
        <div className="flex space-x-3 w-full">
          {/* 登录按钮 - 透明背景，深棕色文字 */}
          <button
            onClick={onLoginClick}
            className="flex-1 px-4 py-3 text-base font-bold
                       text-[#4b3f2f] bg-transparent
                       hover:bg-[#f9f3d2] hover:font-extrabold
                       rounded-md transition-colors duration-200"
          >
            登录
          </button>
          {/* 注册按钮 - 木质色调背景，白色文字 */}
          <button
            onClick={onRegisterClick}
            className="flex-1 px-4 py-3 text-base font-medium
                       text-white bg-[#c49e65] hover:bg-[#a9744f]
                       rounded-lg transition-colors duration-200"
          >
            注册
          </button>
        </div>
      ) : (
        <>
          {/* 登录按钮 - 透明背景，深棕色文字，粗体 */}
          <button
            onClick={onLoginClick}
            className="px-4 py-2 text-base font-bold
                       text-[#4b3f2f] bg-transparent
                       hover:bg-[#f9f3d2] hover:font-extrabold
                       rounded-md transition-colors duration-200"
          >
            登录
          </button>

          {/* 注册按钮（主按钮）- 木质色调背景，白色文字 */}
          <button
            onClick={onRegisterClick}
            className="px-6 py-3 text-base font-medium
                       text-white bg-[#c49e65] hover:bg-[#a9744f]
                       rounded-lg transition-colors duration-200"
          >
            注册
          </button>
        </>
      )}
    </div>
  );
}
