import Layout from '../../components/Layout'
import PostCard from '../../components/PostCard'
import { getAllCategories, getPostsByCategory } from '../../lib/posts'
import Link from 'next/link'

interface CategoryPageProps {
  category: string
  posts: ReturnType<typeof getPostsByCategory>
  categories: string[]
}

export default function CategoryPage({ category, posts, categories }: CategoryPageProps) {
  return (
    <Layout title={`分类: ${category}`}>
      <div className="mb-8">
        <Link href="/categories" className="text-slate-500 hover:text-yellow-600 mb-4 inline-block">
          ← 所有分类
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">
          分类: <span className="text-yellow-600">{category}</span>
        </h1>
        <p className="text-slate-600 mt-2">共 {posts.length} 篇文章</p>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-slate-500 mb-3">其他分类</h3>
        <div className="flex flex-wrap gap-2">
          {categories.filter(c => c !== category).map(c => (
            <Link 
              key={c}
              href={`/categories/${c}/`}
              className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm hover:border-yellow-400 transition-colors"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const categories = getAllCategories()
  return {
    paths: categories.map(category => ({
      params: { category },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { category: string } }) {
  const posts = getPostsByCategory(params.category)
  const categories = getAllCategories()

  return {
    props: {
      category: params.category,
      posts,
      categories,
    },
  }
}
