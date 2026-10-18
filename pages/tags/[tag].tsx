import Layout from '../../components/Layout'
import PostCard from '../../components/PostCard'
import { getAllTags, getPostsByTag } from '../../lib/posts'
import Link from 'next/link'

interface TagPageProps {
  tag: string
  posts: ReturnType<typeof getPostsByTag>
  tags: string[]
}

export default function TagPage({ tag, posts, tags }: TagPageProps) {
  return (
    <Layout title={`标签: ${tag}`}>
      <header className="mb-xl border-b border-line pb-xl">
        <Link href="/tags" className="mb-sm inline-block text-meta text-muted transition-colors hover:text-emerald">
          ← 所有标签
        </Link>
        <p className="mb-sm text-meta font-medium uppercase tracking-xwide text-muted">Tag</p>
        <h1 className="font-display text-title font-bold text-ink">#{tag}</h1>
        <p className="mt-sm text-body text-muted">共 {posts.length} 篇文章</p>
      </header>

      {tags.length > 1 && (
        <div className="mb-lg">
          <p className="mb-sm text-meta text-muted">其他标签</p>
          <div className="flex flex-wrap gap-xs">
            {tags.filter(t => t !== tag).map(t => (
              <Link
                key={t}
                href={`/tags/${t}/`}
                className="rounded-pill bg-mist px-md py-1 text-meta text-muted transition-colors hover:text-emerald"
              >
                #{t}
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
  const tags = getAllTags()
  return {
    paths: tags.map(tag => ({
      params: { tag },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { tag: string } }) {
  const posts = getPostsByTag(params.tag)
  const tags = getAllTags()

  return {
    props: {
      tag: params.tag,
      posts,
      tags,
    },
  }
}
