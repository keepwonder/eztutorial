import Head from 'next/head'
import Link from 'next/link'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import SearchDialog from './SearchDialog'

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
  const [searchOpen, setSearchOpen] = useState(false)
  const themeBtnRef = useRef<HTMLButtonElement>(null)
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/categories', label: '分类' },
    { href: '/tags', label: '标签' },
    { href: '/archive', label: '归档' },
  ]
  const favicon = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='%23151713'/><text x='32' y='42' text-anchor='middle' font-size='30' font-family='Georgia,serif' font-weight='700' fill='%23ffffff'>T</text></svg>"
  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined

  // 全局快捷键：⌘K / Ctrl+K 打开搜索；"/" 在非输入状态下也能唤起
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      } else if (e.key === '/' && !typing) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const currentTheme = useCallback((): 'light' | 'dark' => {
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'light' || attr === 'dark') return attr
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])

  const syncThemeLabel = useCallback(() => {
    const btn = themeBtnRef.current
    if (!btn) return
    const dark = currentTheme() === 'dark'
    btn.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式')
    btn.setAttribute('title', dark ? '切换浅色模式' : '切换深色模式')
  }, [currentTheme])

  // 首屏 label 按 effective theme 同步；无保存偏好时跟随系统变化
  useEffect(() => {
    syncThemeLabel()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem('kiang-theme')
      } catch {
        /* ignore */
      }
      if (!saved) syncThemeLabel()
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [syncThemeLabel])

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('kiang-theme', next)
    } catch {
      /* ignore */
    }
    syncThemeLabel()
  }

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description || 'Kiang 的技术笔记、实践记录与工具教程'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon} />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('kiang-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();",
          }}
        />
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
        <header className="sticky top-0 z-50 border-b border-line site-header backdrop-blur-md">
          <div className="max-w-shell mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Link href="/" className="flex items-center gap-3">
                <span className="font-display text-body font-bold tracking-normal text-ink">EzTutorial</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-meta">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} className="text-muted hover:text-emerald transition-colors">{link.label}</Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <button
                  ref={themeBtnRef}
                  type="button"
                  onClick={toggleTheme}
                  aria-label="切换深色模式"
                  title="切换深色模式"
                  className="theme-toggle grid h-9 w-9 place-items-center rounded-md border border-line text-muted transition-colors hover:border-emerald hover:text-emerald"
                >
                  <svg className="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4.2" />
                    <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
                  </svg>
                  <svg className="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="搜索文章（快捷键 ⌘K）"
                  className="flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-meta text-muted transition-colors hover:border-emerald hover:text-emerald"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M10.8 10.8L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span className="hidden sm:inline">搜索</span>
                  <kbd className="hidden md:inline rounded-sm border border-line px-1 text-meta leading-none py-0.5">⌘K</kbd>
                </button>
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
              <div className="max-w-shell mx-auto px-5 py-2 flex flex-col">
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

        <main className="flex-1 max-w-shell mx-auto px-5 sm:px-8 py-2xl w-full">
          {children}
        </main>

        <footer className="border-t border-line">
          <div className="max-w-shell mx-auto px-5 sm:px-8 py-7">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-meta text-muted">
              <div className="flex items-center gap-3">
                <span>EzTutorial - Kiang 技术笔记</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="https://kiang.website" target="_blank" rel="noopener noreferrer" className="hover:text-emerald transition-colors">主站 ↗</a>
                <Link href="/feed.xml" className="hover:text-emerald transition-colors">RSS 订阅</Link>
                <Link href="/sitemap.xml" className="hover:text-emerald transition-colors">Sitemap</Link>
                <span>© 2026 Kiang</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
