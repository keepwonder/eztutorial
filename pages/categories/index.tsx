import Layout from '../../components/Layout'
import { getAllCategories } from '../../lib/posts'
import Link from 'next/link'

interface CategoriesPageProps {
  categories: string[]
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  return (
    <Layout title="所有分类">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">文章分类</h1>
        <p className="text-slate-600">按主题浏览所有文章</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(category => (
          <Link
            key={category}
            href={`/categories/${category}/`}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-yellow-400 hover:shadow-lg transition-all text-center group"
          >
            <div className="text-3xl mb-3">📁</div>
            <div className="font-bold text-slate-800 group-hover:text-yellow-600 transition-colors">
              {category}
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const categories = getAllCategories()
  return {
    props: {
      categories,
    },
  }
}
