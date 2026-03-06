import Link from 'next/link'
import { Post } from '../lib/posts'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-yellow-400 transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="flex flex-col h-full">
        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            {post.category}
          </span>
          <span>{format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}</span>
          <span>·</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>

        {/* Title */}
        <Link href={`/posts/${post.slug}/`}>
          <h2 className="text-xl font-bold text-slate-800 mb-3 hover:text-yellow-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-600 mb-4 line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <Link 
              key={tag}
              href={`/tags/${tag}/`}
              className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Link 
            href={`/posts/${post.slug}/`}
            className="text-yellow-600 font-medium hover:text-yellow-700 transition-colors"
          >
            阅读全文 →
          </Link>
          {post.modified && post.modified !== post.date && (
            <span className="text-xs text-slate-400">
              更新于 {format(new Date(post.modified), 'MM月dd日', { locale: zhCN })}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
