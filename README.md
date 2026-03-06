# EzTutorial

个人 Markdown 博客平台 - 基于 Next.js 的静态站点生成器。

## 特性

- 📝 **Markdown 原生支持** - 使用熟悉的 Markdown 语法写作
- 🏷️ **分类与标签** - 多维度组织你的内容
- 📊 **阅读统计** - 自动计算阅读时长
- 🎨 **代码高亮** - 支持多种编程语言
- 📱 **响应式设计** - 完美适配移动端
- ⚡ **静态生成** - 超快加载速度

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 添加文章

在 `posts/` 目录下创建 `.md` 文件：

```markdown
---
title: '文章标题'
date: '2026-03-06'
category: '技术'
tags: ['react', 'nextjs']
excerpt: '文章摘要'
---

# 正文内容

你的文章内容...
```

### 构建部署

```bash
npm run export
```

## Frontmatter 字段

| 字段 | 说明 | 必填 |
|------|------|------|
| `title` | 文章标题 | ✅ |
| `date` | 发布日期 | ✅ |
| `category` | 分类 | ✅ |
| `tags` | 标签数组 | ✅ |
| `excerpt` | 文章摘要 | ✅ |
| `modified` | 修改日期 | ❌ |

## 项目结构

```
eztutorial/
├── posts/          # Markdown 文章
├── pages/          # Next.js 页面
├── components/     # React 组件
├── lib/            # 工具函数
├── styles/         # 全局样式
└── public/         # 静态资源
```

## 部署

### Vercel（推荐）

```bash
vercel --prod
```

### 其他平台

构建后的静态文件在 `dist/` 目录，可直接部署到任何静态托管服务。

## 与 EzWrite 联动

未来将支持：
- EzWrite 一键发布到 EzTutorial
- 自动分类和标签
- 版本历史管理

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Markdown + gray-matter
- highlight.js

## License

MIT
