import Layout from '../../components/Layout'
import { getAllTags } from '../../lib/posts'
import Link from 'next/link'

interface TagsPageProps {
  tags: string[]
}

export default function TagsPage({ tags }: TagsPageProps) {
  return (
    <Layout title="所有标签">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">文章标签</h1>
        <p className="text-slate-600">按标签浏览相关文章</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map(tag => (
          <Link
            key={tag}
            href={`/tags/${tag}/`}
            className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm hover:border-yellow-400 hover:text-yellow-600 transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const tags = getAllTags()
  return {
    props: {
      tags,
    },
  }
}
