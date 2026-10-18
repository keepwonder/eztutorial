import Head from 'next/head'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
  ogImage?: string
  canonicalPath?: string
}

const SITE_URL = 'https://eztutorial.kiang.website'

export default function Layout({ children, title, description, ogImage, canonicalPath }: LayoutProps) {
  const siteTitle = 'EzTutorial - Kiang 技术笔记'
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/categories', label: '分类' },
    { href: '/tags', label: '标签' },
    { href: '/archive', label: '归档' },
  ]
  const favicon = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='%23151713'/><text x='32' y='42' text-anchor='middle' font-size='30' font-family='Georgia,serif' font-weight='700' fill='%23ffffff'>T</text></svg>"
  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description || 'Kiang 的技术笔记、实践记录与工具教程'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon} />
        <link rel="alternate" type="application/rss+xml" title="EzTutorial RSS" href="/feed.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:type" content={title ? 'article' : 'website'} />
        <meta property="og:site_name" content="EzTutorial" />
        <meta property="og:title" content={title || siteTitle} />
        <meta property="og:description" content={description || 'Kiang 的技术笔记、实践记录与工具教程'} />
        <meta property="og:url" content={canonicalUrl || SITE_URL} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
          <div className="max-w-shell mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md border border-ink bg-ink font-display text-body font-bold text-paper">T</span>
                <span className="font-display text-body font-bold tracking-normal text-ink">EzTutorial</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-meta">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} className="text-muted hover:text-emerald transition-colors">{link.label}</Link>
                ))}
              </nav>

              <div className="flex items-center gap-4">
                <a
                  href="https://kiang.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline text-meta text-muted hover:text-emerald transition-colors"
                >
                  Kiang
                </a>
                {/* 移动端汉堡按钮 */}
                <button
                  type="button"
                  aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden grid place-items-center h-9 w-9 rounded-md border border-line text-ink hover:border-emerald hover:text-emerald transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    {menuOpen ? (
                      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    ) : (
                      <path d="M2.5 5h13M2.5 9h13M2.5 13h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 移动端下拉菜单 */}
          {menuOpen && (
            <nav className="md:hidden border-t border-line bg-paper">
              <div className="max-w-shell mx-auto px-4 py-2 flex flex-col">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-2.5 text-meta text-ink border-b border-line last:border-b-0 hover:text-emerald transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </header>

        <main className="flex-1 max-w-shell mx-auto px-4 sm:px-6 py-2xl w-full">
          {children}
        </main>

        <footer className="border-t border-line">
          <div className="max-w-shell mx-auto px-4 sm:px-6 py-7">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-meta text-muted">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-sm border border-line font-display text-meta font-bold text-ink">T</span>
                <span>EzTutorial - Kiang 技术笔记</span>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/" className="hover:text-emerald transition-colors">首页</Link>
                <Link href="/archive" className="hover:text-emerald transition-colors">归档</Link>
                <Link href="/feed.xml" className="hover:text-emerald transition-colors">RSS</Link>
                <a href="https://kiang.website" target="_blank" rel="noopener noreferrer" className="hover:text-emerald transition-colors">Kiang</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
