import Link from 'next/link'
import { Post } from '../lib/posts'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-line bg-surface p-lg transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-emerald hover:shadow-lift">
      <div className="mb-sm flex flex-wrap items-center gap-x-sm gap-y-xs text-meta text-muted">
        <span className="rounded-sm border border-line px-2 py-0.5 font-medium text-ink">
          {post.category}
        </span>
        <time dateTime={post.date} className="tracking-wide">
          {format(new Date(post.date), 'yyyy.MM.dd', { locale: zhCN })}
        </time>
        <span>{post.readingTime} 分钟</span>
      </div>

      <Link href={`/posts/${post.slug}/`}>
        <h2 className="mb-sm font-display text-title font-bold leading-snug text-ink transition-colors group-hover:text-emerald">
          {post.title}
        </h2>
      </Link>

      <p className="mb-md line-clamp-3 text-body leading-normal text-muted">
        {post.excerpt}
      </p>

      {post.tags.length > 0 && (
        <div className="mb-md flex flex-wrap gap-xs">
          {post.tags.map(tag => (
            <Link
              key={tag}
              href={`/tags/${tag}/`}
              className="rounded-sm bg-mist px-2 py-0.5 text-meta text-muted transition-colors hover:text-emerald"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-line pt-md">
        <Link
          href={`/posts/${post.slug}/`}
          className="text-meta font-medium text-muted transition-colors group-hover:text-emerald"
        >
          阅读全文 ↗
        </Link>
        {post.modified && post.modified !== post.date && (
          <span className="text-meta text-muted">
            更新于 {format(new Date(post.modified), 'MM月dd日', { locale: zhCN })}
          </span>
        )}
      </div>
    </article>
  )
}
