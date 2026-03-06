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

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      
      const content = matterResult.content
      const wordCount = content.split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200)

      return {
        id,
        slug: id,
        content,
        readingTime,
        category: '其他', // 默认分类
        tags: [],
        excerpt: '',
        ...(matterResult.data as Omit<Post, 'id' | 'slug' | 'content' | 'readingTime'>),
      } as Post
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => ({
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    }))
}

export async function getPostData(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(matterResult.content)
  
  const contentHtml = processedContent.toString()
  
  const wordCount = matterResult.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return {
    slug,
    id: slug,
    content: contentHtml,
    readingTime,
    ...(matterResult.data as Omit<Post, 'slug' | 'id' | 'content' | 'readingTime'>),
  } as Post
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
