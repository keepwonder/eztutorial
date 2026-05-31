import Link from 'next/link'
import { Post } from '../lib/posts'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group rounded-[8px] border border-[rgba(21,23,19,0.14)] bg-[#fffdf8]/82 p-5 transition hover:-translate-y-0.5 hover:border-[#047a55] hover:shadow-[0_18px_48px_rgba(43,36,24,0.12)]">
      <div className="flex h-full flex-col">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#62685f]">
          <span className="rounded-[8px] border border-[rgba(21,23,19,0.14)] bg-[rgba(21,23,19,0.04)] px-2 py-1 font-medium text-[#8f4d35]">
            {post.category}
          </span>
          <span>{format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}</span>
          <span>{post.readingTime} 分钟</span>
        </div>

        <Link href={`/posts/${post.slug}/`}>
          <h2 className="mb-3 text-lg font-semibold leading-snug text-[#151713] transition group-hover:text-[#047a55]">
            {post.title}
          </h2>
        </Link>

        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-6 text-[#62685f]">
          {post.excerpt}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link
              key={tag}
              href={`/tags/${tag}/`}
              className="rounded-[8px] bg-[rgba(21,23,19,0.05)] px-2.5 py-1 text-xs text-[#62685f] transition hover:bg-[rgba(4,122,85,0.10)] hover:text-[#047a55]"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[rgba(21,23,19,0.10)] pt-4">
          <Link href={`/posts/${post.slug}/`} className="text-sm font-medium text-[#047a55] transition hover:text-[#035f43]">
            阅读全文
          </Link>
          {post.modified && post.modified !== post.date && (
            <span className="text-xs text-[#8b8f86]">
              更新于 {format(new Date(post.modified), 'MM月dd日', { locale: zhCN })}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
