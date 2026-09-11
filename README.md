# EzTutorial

> 个人 Markdown 博客平台 —— 基于 Next.js 的静态站点生成器，文章写在 `posts/` 目录下，构建时静态导出。
> 与 EzWrite 配合：EzWrite 写作 → 一键发布到 EzTutorial。

**线上**：https://eztutorial.kiang.website  
**仓**：[keepwonder/eztutorial](https://github.com/keepwonder/eztutorial)（private）  
**Vercel**：`prj_sA8mdZ55sDsEv8PKGIvgPVFqHZ0O`，team `keepwonders-projects`

## 特性

- 📝 **Markdown 原生支持** - 使用熟悉的 Markdown 语法写作
- 🏷️ **分类与标签** - 多维度组织你的内容
- 📊 **阅读统计** - 自动计算阅读时长
- 🎨 **代码高亮** - 支持多种编程语言
- 📱 **响应式设计** - 完美适配移动端
- ⚡ **静态生成** - 超快加载速度

## 技术栈

| 用途 | 选型 |
| --- | --- |
| 框架 | Next.js 14（Pages Router） |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS v3 |
| Markdown | gray-matter + remark + remark-gfm + rehype-highlight |
| 代码高亮 | highlight.js |
| 日期工具 | date-fns |

## 快速开始

```bash
cd eztutorial
npm install
npm run dev          # 本地 http://localhost:3000

npm run export       # 静态导出到 dist/
```

## 添加文章

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

### Frontmatter 字段

| 字段 | 说明 | 必填 |
| --- | --- | --- |
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

### Vercel 自动

```bash
unset NODE_OPTIONS && export NODE_OPTIONS=
export VERCEL_TOKEN=$(cat ~/.workbuddy/secrets/vercel-token)
cd eztutorial
vercel deploy --prod --yes --non-interactive < /dev/null
```

GitHub 集成已启用：`main` 分支推送自动 Production 部署。

### 配置

| 项 | 值 |
| --- | --- |
| Vercel 项目 | `prj_sA8mdZ55sDsEv8PKGIvgPVFqHZ0O` |
| 自定义域 | `eztutorial.kiang.website` |
| DNS（Cloudflare）| CNAME → `cname.vercel-dns.com`，`proxied=false` |
| SSL | Vercel 签发 |
| 输出 | `dist/`（Next.js static export） |

### 其他平台

构建后的静态文件在 `dist/` 目录，可直接部署到任何静态托管服务（GitHub Pages / Netlify / S3 等）。

## 与 EzWrite 联动

- EzWrite 一键发布文章到 `posts/<slug>.md`
- 自动应用 frontmatter（title / date / category / tags / description）
- 推送后 Vercel 自动重新构建

## 许可证

MIT
