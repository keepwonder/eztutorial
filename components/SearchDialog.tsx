import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

interface PostIndexItem {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  tags: string[]
}

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

// 全局搜索：客户端过滤构建期生成的 /posts.json，零依赖、零后端。
// 搜索范围覆盖标题 / 摘要 / 分类 / 标签，随文章数量增长自动生效。
export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<PostIndexItem[] | null>(null)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // 首次打开时按需加载索引并缓存
  useEffect(() => {
    if (!open || posts || error) return
    let cancelled = false
    fetch('/posts.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((list: PostIndexItem[]) => {
        if (!cancelled) setPosts(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [open, posts, error])

  // 打开时聚焦输入框；关闭时清空
  useEffect(() => {
    if (open) {
      setQuery('')
      window.setTimeout(() => inputRef.current?.focus(), 0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Esc 关闭
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const results = useMemo(() => {
    if (!posts) return []
    const q = query.trim().toLowerCase()
    if (!q) return posts.slice(0, 6)
    return posts.filter(post => {
      const haystack = [post.title, post.excerpt, post.category, ...(post.tags || [])]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [posts, query])

  if (!open) return null

  return (
    <div
      className="search-overlay fixed inset-0 z-[60] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="搜索文章"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="mx-auto mt-[8vh] w-full max-w-[560px] overflow-hidden rounded-lg border border-line bg-paper shadow-lift">
        <div className="flex items-center gap-sm border-b border-line px-md">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-muted">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.8 10.8L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索文章、分类或标签…"
            aria-label="搜索文章"
            className="h-12 w-full bg-transparent text-body text-ink outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-sm border border-line px-1.5 py-0.5 text-meta text-muted transition-colors hover:border-emerald hover:text-emerald"
            aria-label="关闭搜索"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-xs">
          {error && <p className="px-md py-lg text-meta text-muted">搜索索引加载失败，请刷新重试。</p>}
          {!error && !posts && <p className="px-md py-lg text-meta text-muted">加载中…</p>}
          {!error && posts && results.length === 0 && (
            <p className="px-md py-lg text-meta text-muted">没有匹配「{query.trim()}」的文章。</p>
          )}
          {!error &&
            results.map(post => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}/`}
                onClick={onClose}
                className="block rounded-sm px-md py-sm transition-colors hover:bg-mist"
              >
                <span className="mb-2xs flex items-center gap-sm text-meta text-muted">
                  <span className="rounded-sm border border-line px-1.5 py-0.5">{post.category}</span>
                  <time dateTime={post.date}>{post.date.replace(/-/g, '.')}</time>
                </span>
                <span className="block text-body font-medium leading-snug text-ink">{post.title}</span>
                {post.excerpt && (
                  <span className="mt-2xs line-clamp-1 block text-meta text-muted">{post.excerpt}</span>
                )}
              </Link>
            ))}
        </div>

        <div className="flex items-center justify-between border-t border-line px-md py-xs text-meta text-muted">
          <span>{query.trim() ? `${results.length} 个结果` : '最近文章'}</span>
          <span>
            <kbd className="rounded-sm border border-line px-1">⌘</kbd>
            <kbd className="ml-2xs rounded-sm border border-line px-1">K</kbd> 打开
          </span>
        </div>
      </div>
    </div>
  )
}
