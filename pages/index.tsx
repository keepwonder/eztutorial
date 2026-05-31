import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import { getAllPosts, getAllCategories, getAllTags } from '../lib/posts'
import Link from 'next/link'

interface HomeProps {
  posts: ReturnType<typeof getAllPosts>
  categories: string[]
  tags: string[]
}

export default function Home({ posts, categories, tags }: HomeProps) {
  const recentPosts = posts.slice(0, 6)
  const totalMinutes = posts.reduce((sum, p) => sum + p.readingTime, 0)

  return (
    <Layout>
      <section className="grid gap-8 border-b border-[rgba(21,23,19,0.14)] pb-8 lg:grid-cols-[minmax(0,0.92fr)_320px]">
        <div>
          <div className="mb-5 inline-flex rounded-[8px] border border-[rgba(21,23,19,0.14)] bg-[#fffdf8]/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#047a55]">
            Kiang Notes
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[#151713] md:text-5xl">
            把技术实践整理成可以反复使用的笔记。
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#62685f]">
            这里记录 AI 编程、前端工程、工具搭建和产品实验。少一点模板叙事，多一点真实工作流。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/archive" className="rounded-[8px] border border-[#151713] bg-[#151713] px-5 py-2.5 text-sm font-medium text-[#fffdf8] transition hover:-translate-y-0.5">
              查看归档
            </Link>
            <Link href="/categories" className="rounded-[8px] border border-[rgba(21,23,19,0.18)] bg-[#fffdf8]/75 px-5 py-2.5 text-sm font-medium text-[#151713] transition hover:border-[#047a55] hover:text-[#047a55]">
              浏览分类
            </Link>
          </div>
        </div>

        <aside className="grid gap-3 self-end rounded-[8px] border border-[rgba(21,23,19,0.14)] bg-[#fffdf8]/70 p-4">
          <div className="flex items-baseline justify-between border-b border-[rgba(21,23,19,0.10)] pb-3">
            <span className="text-sm text-[#62685f]">文章</span>
            <strong className="text-2xl text-[#151713]">{posts.length}</strong>
          </div>
          <div className="flex items-baseline justify-between border-b border-[rgba(21,23,19,0.10)] pb-3">
            <span className="text-sm text-[#62685f]">分类</span>
            <strong className="text-2xl text-[#151713]">{categories.length}</strong>
          </div>
          <div className="flex items-baseline justify-between border-b border-[rgba(21,23,19,0.10)] pb-3">
            <span className="text-sm text-[#62685f]">标签</span>
            <strong className="text-2xl text-[#151713]">{tags.length}</strong>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[#62685f]">阅读量</span>
            <strong className="text-2xl text-[#151713]">{Math.ceil(totalMinutes / 60)}h</strong>
          </div>
        </aside>
      </section>

      <section className="pt-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8f4d35]">最新文章</h2>
          <Link href="/archive" className="text-sm font-medium text-[#047a55] hover:text-[#035f43]">
            查看全部
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const tags = getAllTags()

  return {
    props: {
      posts,
      categories,
      tags,
    },
  }
}
