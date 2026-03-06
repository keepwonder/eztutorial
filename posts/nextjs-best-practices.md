---
title: 'Next.js 开发最佳实践'
date: '2026-03-05'
modified: '2026-03-06'
category: '技术'
tags: ['nextjs', 'react', 'frontend']
excerpt: '总结 Next.js 14 开发中的最佳实践，包括 App Router、Server Components、数据获取等核心概念。'
---

# Next.js 开发最佳实践

Next.js 14 带来了许多激动人心的特性。

## App Router

App Router 是 Next.js 13+ 推荐的 routing 方案。

### 核心概念

```typescript
// app/page.tsx
export default function Home() {
  return <h1>Hello Next.js!</h1>
}
```

## Server Components

默认情况下，Next.js 的组件都是 Server Components。

### 优势

- 减少客户端 JavaScript
- 直接访问后端资源
- 更好的性能

### 使用 Client Components

当需要使用浏览器 API 或 React hooks 时：

```typescript
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c + 1)}>{count}</button>
}
```

## 数据获取

### Server Components 中获取数据

```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.title}</div>
}
```

## 部署

推荐使用 Vercel 进行部署：

```bash
vercel --prod
```

## 总结

Next.js 14 是现代 React 应用的首选框架。
