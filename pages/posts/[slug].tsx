import Layout from '../../components/Layout'
import { getAllPostIds, getPostData, Post } from '../../lib/posts'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from 'next/link'
import Head from 'next/head'

interface PostPageProps {
  post: Post
}

export default function PostPage({ post }: PostPageProps) {
  return (
    <Layout title={post.title} description={post.excerpt}>
      <Head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" async></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
      </Head>

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-2xl p-8 border border-slate-200 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link 
              href={`/categories/${post.category}/`}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors"
            >
              {post.category}
            </Link>
            {post.tags.map(tag => (
              <Link 
                key={tag}
                href={`/tags/${tag}/`}
                className="text-sm text-slate-500 hover:text-yellow-600 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>发布于 {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}</span>
            <span>·</span>
            <span>{post.readingTime} 分钟阅读</span>
            {post.modified && post.modified !== post.date && (
              <>
                <span>·</span>
                <span>更新于 {format(new Date(post.modified), 'yyyy年MM月dd日', { locale: zhCN })}</span>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link 
            href="/" 
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            ← 返回首页
          </Link>
          <Link 
            href="/archive" 
            className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
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
  const paths = getAllPostIds()
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
