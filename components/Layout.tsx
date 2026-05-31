import Head from 'next/head'
import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function Layout({ children, title, description }: LayoutProps) {
  const siteTitle = 'EzTutorial - Kiang 技术笔记'
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const favicon = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='%23151713'/><text x='32' y='42' text-anchor='middle' font-size='30' font-family='Arial' font-weight='700' fill='%23f7f2e8'>T</text></svg>"

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description || 'Kiang 的技术笔记、实践记录与工具教程'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon} />
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 border-b border-[rgba(21,23,19,0.14)] bg-[#f7f2e8]/90 backdrop-blur-md">
          <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-[8px] border border-[#151713] bg-[#151713] text-sm font-bold text-[#f7f2e8]">T</span>
                <span className="text-lg font-semibold text-[#151713]">EzTutorial</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/" className="text-[#62685f] hover:text-[#047a55] transition-colors">首页</Link>
                <Link href="/categories" className="text-[#62685f] hover:text-[#047a55] transition-colors">分类</Link>
                <Link href="/tags" className="text-[#62685f] hover:text-[#047a55] transition-colors">标签</Link>
                <Link href="/archive" className="text-[#62685f] hover:text-[#047a55] transition-colors">归档</Link>
              </nav>

              <a
                href="https://kiang.website"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#62685f] hover:text-[#047a55] transition-colors"
              >
                Kiang
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </main>

        <footer className="border-t border-[rgba(21,23,19,0.14)] bg-[#151713] text-[#f7f2e8]">
          <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-[8px] border border-[#f7f2e8]/30 text-xs font-bold">T</span>
                <span>EzTutorial - Kiang 技术笔记</span>
              </div>
              <div className="flex items-center gap-6 text-[#d7d0c1]">
                <Link href="/" className="hover:text-white transition-colors">首页</Link>
                <a href="https://kiang.website" target="_blank" className="hover:text-white transition-colors">Kiang</a>
                <span>© 2026</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
