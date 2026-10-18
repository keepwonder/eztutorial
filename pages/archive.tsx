import Layout from '../components/Layout'
import { getAllPosts } from '../lib/posts'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface ArchivePageProps {
  posts: ReturnType<typeof getAllPosts>
}

export default function ArchivePage({ posts }: ArchivePageProps) {
  // 按年份分组
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {} as Record<number, typeof posts>)

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <Layout title="文章归档">
      <header className="mb-xl border-b border-line pb-xl">
        <p className="mb-sm text-meta font-medium uppercase tracking-xwide text-muted">Archive</p>
        <h1 className="font-display text-title font-bold text-ink">文章归档</h1>
        <p className="mt-sm text-body text-muted">共 {posts.length} 篇文章，按时间倒序排列</p>
      </header>

      <div className="space-y-2xl">
        {years.map(year => (
          <section key={year}>
            <h2 className="mb-md flex items-baseline gap-sm font-display text-title font-bold text-ink">
              {year}
              <span className="text-meta font-normal text-muted">{postsByYear[Number(year)].length} 篇</span>
            </h2>

            <div className="overflow-hidden rounded-md border border-line">
              {postsByYear[Number(year)].map((post, index) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}/`}
                  className={`flex items-center justify-between gap-md px-md py-sm transition-colors hover:bg-mist ${
                    index !== postsByYear[Number(year)].length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <div className="flex min-w-0 items-baseline gap-md">
                    <time dateTime={post.date} className="w-16 shrink-0 font-mono text-meta text-muted">
                      {format(new Date(post.date), 'MM.dd', { locale: zhCN })}
                    </time>
                    <span className="truncate text-body font-medium text-ink">{post.title}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-sm">
                    <span className="hidden rounded-sm border border-line px-2 py-0.5 text-meta text-muted sm:inline">
                      {post.category}
                    </span>
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="hidden text-meta text-muted md:inline">
                        #{tag}
                      </span>
                    ))}
                    <span aria-hidden="true" className="text-meta text-muted">↗</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  return {
    props: {
      posts,
    },
  }
}
