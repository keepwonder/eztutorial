import Layout from '../../components/Layout'
import { getAllPosts, getAllTags } from '../../lib/posts'
import Link from 'next/link'

interface TagsPageProps {
  tags: string[]
  counts: Record<string, number>
}

export default function TagsPage({ tags, counts }: TagsPageProps) {
  return (
    <Layout title="所有标签">
      <header className="mb-xl border-b border-line pb-xl">
        <p className="mb-sm text-meta font-medium uppercase tracking-xwide text-muted">Tags</p>
        <h1 className="font-display text-title font-bold text-ink">文章标签</h1>
        <p className="mt-sm text-body text-muted">按标签浏览相关文章</p>
      </header>

      <div className="flex flex-wrap gap-sm">
        {tags.map(tag => (
          <Link
            key={tag}
            href={`/tags/${tag}/`}
            className="rounded-pill border border-line px-md py-1.5 text-meta text-muted transition-colors hover:border-emerald hover:text-emerald"
          >
            #{tag}
            <span className="ml-1 text-muted">{counts[tag] ?? 0}</span>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  const counts = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  return {
    props: {
      tags: getAllTags(),
      counts,
    },
  }
}
