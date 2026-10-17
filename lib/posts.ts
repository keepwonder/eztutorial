import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface Post {
  id: string
  title: string
  date: string
  modified?: string
  category: string
  tags: string[]
  excerpt: string
  content: string
  slug: string
  readingTime: number
}

// 中文按 400 字/分钟、其余按 200 词/分钟估算（中文没有空格，split(/\s+/) 会严重低估）
export function estimateReadingTime(content: string): number {
  const cjkChars = (content.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g) || []).length
  const otherWords = content
    .replace(/[\u3400-\u4dbf\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(cjkChars / 400 + otherWords / 200))
}

// excerpt 缺失时截取正文前 80 个字符（去掉 Markdown 标记与图片语法）
function fallbackExcerpt(content: string): string {
  const plain = content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`~_\-\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.slice(0, 80) + (plain.length > 80 ? '…' : '')
}

interface RawPost {
  id: string
  data: Record<string, unknown>
  content: string
}

function readRawPost(fileName: string): RawPost {
  const id = fileName.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, fileName)
  const matterResult = matter(fs.readFileSync(fullPath, 'utf8'))
  return { id, data: matterResult.data as Record<string, unknown>, content: matterResult.content }
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory).filter(fileName => fileName.endsWith('.md'))
  const allPostsData = fileNames.map(fileName => {
    const raw = readRawPost(fileName)
    const data = raw.data as Omit<Post, 'id' | 'slug' | 'content' | 'readingTime'> & { draft?: boolean; slug?: string }

    if (!data.excerpt || !data.tags || (Array.isArray(data.tags) && data.tags.length === 0)) {
      console.warn(`[posts] "${raw.id}" 缺少 excerpt 或 tags，已用兜底值，建议补全 frontmatter`)
    }

    return {
      id: raw.id,
      slug: (data.slug as string) || raw.id,
      content: raw.content,
      readingTime: estimateReadingTime(raw.content),
      ...data,
      category: data.category || '其他',
      tags: data.tags || [],
      excerpt: data.excerpt || fallbackExcerpt(raw.content),
    } as Post
  })

  return allPostsData
    .filter(post => !(post as unknown as { draft?: boolean }).draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

// 每篇文章暴露全部可访问路径：slug 优先，原文件名保持兼容（老链接不 404）
export function getAllPostPaths(): { params: { slug: string } }[] {
  const fileNames = fs.readdirSync(postsDirectory).filter(fileName => fileName.endsWith('.md'))
  return fileNames.flatMap(fileName => {
    const { id, data } = readRawPost(fileName)
    const paths = [{ params: { slug: id } }]
    const slug = data.slug as string | undefined
    if (slug && slug !== id) paths.push({ params: { slug } })
    return paths
  })
}

// 外链图片统一注入懒加载 + 异步解码，避免首屏拉全量图与布局抖动
function lazyLoadImages(html: string): string {
  return html.replace(/<img\b(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"')
}

export function getPostData(slug: string): Promise<Post> {
  const fileNames = fs.readdirSync(postsDirectory).filter(fileName => fileName.endsWith('.md'))
  // 优先按 slug 匹配，其次按文件名（id）匹配，保证新旧链接都能打开
  const matched =
    fileNames.find(fileName => (readRawPost(fileName).data.slug as string) === slug) ||
    fileNames.find(fileName => fileName.replace(/\.md$/, '') === slug)

  if (!matched) throw new Error(`Post not found: ${slug}`)

  const raw = readRawPost(matched)
  const data = raw.data as Omit<Post, 'id' | 'slug' | 'content' | 'readingTime'>

  return remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(raw.content)
    .then(processedContent => ({
      slug,
      id: raw.id,
      content: lazyLoadImages(processedContent.toString()),
      readingTime: estimateReadingTime(raw.content),
      ...data,
      category: data.category || '其他',
      tags: data.tags || [],
      excerpt: data.excerpt || fallbackExcerpt(raw.content),
    } as Post))
}

export function getAllCategories() {
  const posts = getAllPosts()
  const categories = new Set(posts.map(post => post.category).filter(Boolean))
  return Array.from(categories).sort()
}

export function getAllTags() {
  const posts = getAllPosts()
  const tags = new Set(posts.flatMap(post => post.tags))
  return Array.from(tags).sort()
}

export function getPostsByCategory(category: string) {
  const posts = getAllPosts()
  return posts.filter(post => post.category === category)
}

export function getPostsByTag(tag: string) {
  const posts = getAllPosts()
  return posts.filter(post => post.tags.includes(tag))
}
