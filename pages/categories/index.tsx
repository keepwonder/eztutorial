import Layout from '../../components/Layout'
import { getAllPosts, getAllCategories } from '../../lib/posts'
import Link from 'next/link'

interface CategoriesPageProps {
  categories: string[]
  counts: Record<string, number>
}

export default function CategoriesPage({ categories, counts }: CategoriesPageProps) {
  return (
    <Layout title="所有分类">
      <header className="mb-xl border-b border-line pb-xl">
        <p className="mb-sm text-meta font-medium uppercase tracking-xwide text-muted">Categories</p>
        <h1 className="font-display text-title font-bold text-ink">文章分类</h1>
        <p className="mt-sm text-body text-muted">按主题浏览所有文章</p>
      </header>

      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 md:grid-cols-3">
        {categories.map(category => (
          <Link
            key={category}
            href={`/categories/${category}/`}
            className="group flex items-baseline justify-between rounded-md border border-line px-lg py-md transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-emerald"
          >
            <span className="font-display text-title font-bold text-ink transition-colors group-hover:text-emerald">
              {category}
            </span>
            <span className="text-meta text-muted">{counts[category] ?? 0} 篇</span>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  const counts = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    props: {
      categories: getAllCategories(),
      counts,
    },
  }
}
