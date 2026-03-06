import Head from 'next/head'
import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function Layout({ children, title, description }: LayoutProps) {
  const siteTitle = 'EzTutorial - 个人技术博客'
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description || '基于 Markdown 的个人技术博客'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📖</text></svg>" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-white text-2xl">
                📖
              </div>
              <span className="text-xl font-bold text-slate-800">EzTutorial</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-slate-600 hover:text-yellow-600 transition-colors">
                首页
              </Link>
              <Link href="/categories" className="text-slate-600 hover:text-yellow-600 transition-colors">
                分类
              </Link>
              <Link href="/tags" className="text-slate-600 hover:text-yellow-600 transition-colors">
                标签
              </Link>
              <Link href="/archive" className="text-slate-600 hover:text-yellow-600 transition-colors">
                归档
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <a 
                href="https://keepwonder.top" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-yellow-600 transition-colors"
              >
                主页 →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-lg">
                📖
              </div>
              <span className="text-slate-600 text-sm">EzTutorial - 个人技术博客</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/" className="hover:text-yellow-600 transition-colors">首页</Link>
              <a href="https://keepwonder.top" target="_blank" className="hover:text-yellow-600 transition-colors">主页</a>
              <span>© 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
