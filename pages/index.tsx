import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import { getAllPosts, getAllCategories, getAllTags } from '../lib/posts'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface HomeProps {
  posts: ReturnType<typeof getAllPosts>
  categories: string[]
  tags: string[]
}

export default function Home({ posts, categories, tags }: HomeProps) {
  const recentPosts = posts.slice(0, 6)
  const latestDate = posts[0]?.date

  return (
    <Layout>
      {/* Hero：与主站同一结构——眉标 / 衬线大标题 / 描述 / 双按钮 + 右侧数据栏 */}
      <section className="grid gap-xl border-b border-line pb-xl md:grid-cols-[minmax(0,0.92fr)_280px]">
        <div>
          <p className="mb-sm text-meta font-medium uppercase tracking-xwide text-muted">
            Kiang Notes
          </p>
          <h1 className="max-w-[18em] font-display text-display font-bold text-ink">
            把技术实践整理成可以反复使用的笔记。
          </h1>
          <p className="mt-lg max-w-[36em] text-body leading-normal text-muted">
            这里记录 AI 编程、前端工程、工具搭建和产品实验。少一点模板叙事，多一点真实工作流。
          </p>
          <div className="mt-xl flex flex-wrap gap-sm">
            <Link
              href="/archive"
              className="rounded-md bg-ink px-5 py-2.5 text-body font-medium text-paper transition-transform hover:-translate-y-0.5"
            >
              查看归档
            </Link>
            <Link
              href="/categories"
              className="rounded-md border border-line px-5 py-2.5 text-body font-medium text-ink transition-colors hover:border-emerald hover:text-emerald"
            >
              浏览分类
            </Link>
          </div>
        </div>

        <aside className="grid content-start gap-0 self-end rounded-md border border-line p-md" aria-label="站点数据">
          <div className="flex items-baseline justify-between border-b border-line py-sm first:pt-0">
            <span className="text-meta text-muted">文章</span>
            <strong className="font-display text-title font-bold text-ink">{posts.length}</strong>
          </div>
          <div className="flex items-baseline justify-between border-b border-line py-sm">
            <span className="text-meta text-muted">分类</span>
            <strong className="font-display text-title font-bold text-ink">{categories.length}</strong>
          </div>
          <div className="flex items-baseline justify-between border-b border-line py-sm">
            <span className="text-meta text-muted">标签</span>
            <strong className="font-display text-title font-bold text-ink">{tags.length}</strong>
          </div>
          <div className="flex items-baseline justify-between py-sm pb-0">
            <span className="text-meta text-muted">最近更新</span>
            <strong className="font-display text-title font-bold text-ink">
              {latestDate ? format(new Date(latestDate), 'MM.dd', { locale: zhCN }) : '—'}
            </strong>
          </div>
        </aside>
      </section>

      <section className="pt-xl">
        <div className="mb-lg flex items-end justify-between gap-md">
          <h2 className="font-display text-title font-bold text-ink">最新文章</h2>
          <Link href="/archive" className="text-meta font-medium text-muted transition-colors hover:text-emerald">
            查看全部文章 ↗
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2 md:grid-cols-3">
            {recentPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-body text-muted">还没有文章。</p>
        )}
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  return {
    props: {
      posts,
      categories: getAllCategories(),
      tags: getAllTags(),
    },
  }
}
