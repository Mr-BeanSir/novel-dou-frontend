# 读书豆 - 小说阅读网站前端

基于 Next.js 15 (App Router) 开发的现代化小说阅读平台前端，支持响应式设计和暗色/亮色主题切换。

## 功能特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ 暗色/亮色主题切换
- ✅ 用户认证系统（登录/注册）
- ✅ 小说展示和分类浏览
- ✅ 小说详情页（完整功能）
- ✅ 搜索功能
- ✅ 收藏和阅读历史
- ✅ 评论和评分系统
- ✅ 章节列表和阅读
- ✅ TypeScript 类型安全

## 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS v4
- **语言**: TypeScript
- **字体**: Noto Serif SC (中文衬线字体)
- **图标**: SVG 图标

## 主题设计

### 亮色主题（阅读模式）
- 背景色：纸张黄 (#fef8e7)
- 次要背景：浅木色 (#f9f3d2)
- 文字颜色：深棕色 (#4b3f2f)
- 强调色：柔和木质色 (#c49e65)

### 暗色主题
- 背景色：深棕色 (#1a1a1a)
- 次要背景：深灰色 (#121212)
- 文字颜色：浅米白 (#eae3cc)
- 强调色：暖灰色 (#89775f)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=读书豆
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── novel/[id]/        # 小说详情页
│   │   ├── page.tsx       # 详情页面
│   │   ├── loading.tsx    # 加载状态
│   │   ├── error.tsx      # 错误处理
│   │   └── not-found.tsx  # 404 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── layout/           # 布局相关组件
│   │   ├── Header.tsx         # 顶部导航栏
│   │   ├── LoadingSpinner.tsx # 加载动画
│   │   └── ThemeToggle.tsx    # 主题切换按钮
│   ├── auth/             # 认证相关组件
│   │   ├── AuthModal.tsx      # 登录/注册弹窗
│   │   └── AuthButtonGroup.tsx # 认证按钮组
│   └── novel/            # 小说相关组件
│       ├── card/             # 卡片展示组件
│       │   └── NovelCard.tsx      # 小说卡片
│       ├── detail/           # 详情页面组件
│       │   ├── NovelDetail.tsx    # 小说详情组件
│       │   └── ActionButtons.tsx  # 操作按钮组件
│       ├── rating/           # 评分相关组件
│       │   ├── RatingDisplay.tsx  # 评分显示组件
│       │   ├── RatingDistribution.tsx # 评分分布组件
│       │   └── RatingSection.tsx  # 评分区域组件
│       ├── chapter/          # 章节相关组件
│       │   └── ChapterList.tsx    # 章节列表组件
│       └── comment/          # 评论相关组件
│           └── CommentSection.tsx # 评论区组件
├── hooks/                 # 自定义 Hooks
│   ├── useAuth.ts         # 用户认证
│   └── useTheme.ts        # 主题切换
├── lib/                   # 工具函数
│   ├── api.ts             # API 请求封装
│   ├── auth.ts            # 认证相关函数
│   └── novel-api.ts       # 小说 API 函数
├── services/              # 业务服务层
│   ├── novel.ts           # 小说相关服务
│   └── auth.ts            # 认证服务
└── types/                 # TypeScript 类型定义
    ├── novel.ts           # 小说相关类型
    └── user.ts            # 用户相关类型
```

## API 集成

项目已集成后端 API，支持以下功能：

### 小说相关
- 获取小说列表、详情
- 推荐小说、热门小说、最近更新
- 分类和标签管理
- 章节阅读

### 用户相关
- 用户注册、登录、登出
- 获取用户信息
- 权限管理

### 交互功能
- 收藏小说
- 阅读历史
- 评论和评分

## 开发指南

### 添加新页面

在 `src/app/` 目录下创建新的路由文件夹和 `page.tsx` 文件。

### 添加新组件

在 `src/components/` 目录下创建新组件，使用 TypeScript 和 Tailwind CSS。

### 主题样式

使用预定义的主题颜色类：

```tsx
// 亮色主题
className="bg-light-bg text-light-text border-light-border"

// 暗色主题（自动切换）
className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
```

### API 调用

使用封装好的 API 函数：

```tsx
import { getNovels, getRecommendedNovels } from '@/lib/novel-api';

const novels = await getNovels({ page: 1, per_page: 10 });
```

## 构建和部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。
