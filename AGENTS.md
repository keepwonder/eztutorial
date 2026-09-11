# AGENTS.md · `eztutorial/`

> AI Agent 在 EzTutorial 仓工作时的指南。
> 通用工作区规则见上级目录的 `AGENTS.md`。

## 0. 一句话定位

个人 Markdown 博客平台（Next.js 14 Pages Router + static export）。文章写在 `posts/` 目录，构建时静态导出，由 Vercel 自动部署。

## 1. 项目结构

```
eztutorial/
├── pages/              # Next.js Pages Router
│   ├── index.tsx       # 博客首页（文章列表）
│   ├── posts/[slug].tsx# 单篇文章页
│   └── _app.tsx
├── components/         # React 组件
├── lib/                # 工具函数（gray-matter、remark 配置等）
├── styles/             # 全局样式
├── posts/              # Markdown 文章目录
│   └── *.md            # 每篇文章一个文件
├── public/             # 静态资源
├── dist/               # build 产物（gitignored）
├── next.config.js
└── package.json
```

## 2. 修改工作流

### 加新文章

```bash
cd eztutorial/posts
$EDITOR my-new-post.md   # 写 frontmatter + 正文
git add posts/my-new-post.md
git commit -m "post: add <标题>"
git push
# Vercel 自动构建，~30s 后 https://eztutorial.kiang.website/posts/my-new-post
```

Frontmatter 字段见 README.md（必填：title/date/category/tags/excerpt）。

### 改主题/样式

```bash
cd eztutorial
$EDITOR styles/           # 或 components/、tailwind.config.js
npm run dev               # http://localhost:3000
git push                  # 部署
```

## 3. 关键不变量

### 3.1 文章路径与文件名

- 文章放在 `posts/` 目录
- 文件名 = URL slug：`我的第一篇文章.md` → `/posts/我的第一篇文章`
- 文件名**不能改**（改了就 404，外部链接全断）
- frontmatter `title` 与文件名解耦，可独立改

### 3.2 静态导出配置

`next.config.js` 必须保持 `output: 'export'`。不要改成 `standalone` 或 lambda 模式 —— Vercel 静态部署，lambda 模式会让 CDN 边缘缓存失效。

### 3.3 Markdown 解析管线

固定：`gray-matter` → `remark` → `remark-gfm` → `rehype-highlight`。新增 Markdown 扩展能力**加在 `lib/` 里**，不要换基础管线（换管线会导致所有现存文章渲染结果不一致）。

### 3.4 代码高亮主题

`highlight.js` 的主题在 `styles/highlight.css` 引入。**改色板要保持 Kiang 视觉系统的色调**（米色背景 + 翡翠绿主色），不要引入高对比度的纯黑主题。

## 4. 不要做的事

- ❌ 改 `output: 'export'` 为其他模式
- ❌ 在 `posts/` 里放非 `.md` 文件
- ❌ 改文件名（外部链接会 404）
- ❌ 删除/移动 `posts/` 里已有文章（直接保留或在 frontmatter 里 `date: deprecated`）
- ❌ 引入数据库（产品形态就是纯静态）

## 5. 部署踩坑

同 `ezwrite/AGENTS.md` 第 5 节：NODE_OPTIONS、SSH push、vercel CLI stdin、git author email。

## 6. 与其他项目的关系

- **上游**：被 `ezwrite/` 通过 GitHub Contents API 写入（`src/lib/github.ts` in ezwrite）
- **下游**：主页 `site/projects.json` 引用，截图由 `site/scripts/screenshot.mjs` 生成
- **样式独立**：与 ezwrite 视觉同源（Kiang 色板），但实现分离
