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
      <header className="mb-xl border-b border-line pb-xl">
        <Link href="/categories" className="mb-sm inline-block text-meta text-muted transition-colors hover:text-emerald">
          ← 所有分类
        </Link>
        <p className="mb-sm text-meta font-medium uppercase tracking-xwide text-muted">Category</p>
        <h1 className="font-display text-title font-bold text-ink">{category}</h1>
        <p className="mt-sm text-body text-muted">共 {posts.length} 篇文章</p>
      </header>

      {categories.length > 1 && (
        <div className="mb-lg">
          <p className="mb-sm text-meta text-muted">其他分类</p>
          <div className="flex flex-wrap gap-xs">
            {categories.filter(c => c !== category).map(c => (
              <Link
                key={c}
                href={`/categories/${c}/`}
                className="rounded-pill border border-line px-md py-1 text-meta text-muted transition-colors hover:border-emerald hover:text-emerald"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 md:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const categories = getAllCategories().filter(Boolean) // 过滤掉空值
  return {
    paths: categories.map(category => ({
      params: { category: String(category) }, // 确保是字符串
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
