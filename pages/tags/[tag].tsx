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
      <div className="mb-8">
        <Link href="/tags" className="text-slate-500 hover:text-yellow-600 mb-4 inline-block">
          ← 所有标签
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">
          标签: <span className="text-yellow-600">#{tag}</span>
        </h1>
        <p className="text-slate-600 mt-2">共 {posts.length} 篇文章</p>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-slate-500 mb-3">其他标签</h3>
        <div className="flex flex-wrap gap-2">
          {tags.filter(t => t !== tag).map(t => (
            <Link 
              key={t}
              href={`/tags/${t}/`}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
            >
              #{t}
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
