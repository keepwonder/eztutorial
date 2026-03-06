---
title: '欢迎使用 EzTutorial'
date: '2026-03-06'
category: '教程'
tags: ['eztutorial', 'markdown', '开始']
excerpt: 'EzTutorial 是一个基于 Markdown 的个人博客系统，支持分类、标签、代码高亮等特性。本文介绍如何使用 EzTutorial 发布内容。'
---

# 欢迎使用 EzTutorial

EzTutorial 是一个基于 **Markdown** 的个人技术博客平台。

## 特性

- 📝 **Markdown 原生支持** - 使用熟悉的 Markdown 语法写作
- 🏷️ **分类与标签** - 多维度组织你的内容
- 📊 **阅读统计** - 自动计算阅读时长
- 🎨 **代码高亮** - 支持多种编程语言
- 📱 **响应式设计** - 完美适配移动端

## 快速开始

### 1. 创建文章

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

### 2. Frontmatter 说明

| 字段 | 说明 | 必填 |
|------|------|------|
| `title` | 文章标题 | ✅ |
| `date` | 发布日期 | ✅ |
| `category` | 分类 | ✅ |
| `tags` | 标签数组 | ✅ |
| `excerpt` | 文章摘要 | ✅ |
| `modified` | 修改日期 | ❌ |

### 3. 发布

```bash
# 本地预览
npm run dev

# 构建
npm run build

# 推送到 GitHub 自动部署
git add .
git commit -m "添加新文章"
git push origin main
```

## Markdown 语法示例

### 代码块

```javascript
// JavaScript 示例
function hello() {
  console.log('Hello, EzTutorial!')
}
```

```python
# Python 示例
def hello():
    print("Hello, EzTutorial!")
```

### 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| Markdown | ✅ | 完全支持 |
| 代码高亮 | ✅ | 100+ 语言 |
| 数学公式 | 🚧 | 开发中 |

### 引用

> EzTutorial 让写作变得简单。
> 
> —— 作者

## 与 EzWrite 联动

未来 EzWrite 将支持一键发布到 EzTutorial：

1. 在 EzWrite 中写作
2. 一键推送到 EzTutorial
3. 自动分类和标签
4. 版本历史管理

## 结语

开始你的写作之旅吧！
