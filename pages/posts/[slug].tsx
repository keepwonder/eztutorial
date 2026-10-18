import Layout from '../../components/Layout'
import { getAllPostPaths, getPostData, Post } from '../../lib/posts'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from 'next/link'
import Head from 'next/head'

interface PostPageProps {
  post: Post
}

export default function PostPage({ post }: PostPageProps) {
  const firstImage = post.content.match(/<img[^>]+src="([^"]+)"/)
  return (
    <Layout
      title={post.title}
      description={post.excerpt}
      ogImage={firstImage ? firstImage[1] : undefined}
      canonicalPath={`/posts/${post.slug}/`}
    >
      <Head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" async></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
      </Head>

      <article className="mx-auto max-w-[68ch]">
        {/* Header */}
        <header className="mb-xl border-b border-line pb-xl">
          <div className="mb-sm flex flex-wrap items-center gap-x-sm gap-y-xs text-meta text-muted">
            <Link href={`/categories/${post.category}/`} className="rounded-sm border border-line px-2 py-0.5 font-medium text-ink transition-colors hover:border-emerald hover:text-emerald">
              {post.category}
            </Link>
            {post.tags.map(tag => (
              <Link key={tag} href={`/tags/${tag}/`} className="transition-colors hover:text-emerald">
                #{tag}
              </Link>
            ))}
          </div>

          <h1 className="mb-md font-display text-title font-bold leading-tight text-ink">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-sm text-meta text-muted">
            <time dateTime={post.date}>
              发布于 {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} 分钟阅读</span>
            {post.modified && post.modified !== post.date && (
              <>
                <span aria-hidden="true">·</span>
                <span>更新于 {format(new Date(post.modified), 'yyyy年MM月dd日', { locale: zhCN })}</span>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Navigation */}
        <div className="mt-xl flex justify-between border-t border-line pt-lg">
          <Link
            href="/"
            className="rounded-md border border-line px-md py-2 text-meta font-medium text-ink transition-colors hover:border-emerald hover:text-emerald"
          >
            ← 返回首页
          </Link>
          <Link
            href="/archive"
            className="rounded-md bg-ink px-md py-2 text-meta font-medium text-paper transition-transform hover:-translate-y-0.5"
          >
            浏览更多文章
          </Link>
        </div>
      </article>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            if (typeof hljs !== 'undefined') {
              hljs.highlightAll();
            }
          });
        `
      }} />
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostPaths()
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug)
  return {
    props: {
      post,
    },
  }
}
