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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">文章归档</h1>
        <p className="text-slate-600">共 {posts.length} 篇文章，按时间倒序排列</p>
      </div>

      <div className="space-y-8">
        {years.map(year => (
          <section key={year}>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="text-yellow-600">{year}</span>
              <span className="text-lg text-slate-400 font-normal">({postsByYear[Number(year)].length} 篇)</span>
            </h2>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {postsByYear[Number(year)].map((post, index) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}/`}
                  className={`flex items-center justify-between p-4 hover:bg-yellow-50 transition-colors ${
                    index !== postsByYear[Number(year)].length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400 w-20">
                      {format(new Date(post.date), 'MM月dd日', { locale: zhCN })}
                    </span>
                    <span className="font-medium text-slate-800">{post.title}</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs text-slate-400 hidden sm:inline">
                        #{tag}
                      </span>
                    ))}
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
