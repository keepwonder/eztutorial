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

  return (
    <Layout>
      {/* Hero */}
      <section className="mb-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              探索技术的无限可能
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              记录学习历程，分享技术见解，沉淀知识体系。
              基于 Markdown 的个人博客，简洁而强大。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/categories" 
                className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors"
              >
                浏览分类
              </Link>
              <Link 
                href="/archive" 
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                查看归档
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
          <div className="text-3xl font-bold text-yellow-600">{posts.length}</div>
          <div className="text-sm text-slate-500 mt-1">篇文章</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
          <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
          <div className="text-sm text-slate-500 mt-1">个分类</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
          <div className="text-3xl font-bold text-purple-600">{tags.length}</div>
          <div className="text-sm text-slate-500 mt-1">个标签</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
          <div className="text-3xl font-bold text-green-600">{Math.ceil(posts.reduce((sum, p) => sum + p.readingTime, 0) / 60)}</div>
          <div className="text-sm text-slate-500 mt-1">小时内容</div>
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">最新文章</h2>
          <Link href="/archive" className="text-yellow-600 hover:text-yellow-700">
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
