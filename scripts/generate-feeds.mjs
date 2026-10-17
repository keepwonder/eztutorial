// 构建后生成 dist/sitemap.xml 与 dist/feed.xml（静态导出无法用 Next 内置路由，故用脚本）
// 用法: node scripts/generate-feeds.mjs  （需在 next build 之后运行）
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')
const outDir = path.join(process.cwd(), 'dist')
const SITE_URL = 'https://eztutorial.kiang.website'

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}

function excerptOf(content) {
  const plain = content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`~_\-\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.slice(0, 120)
}

const posts = fs
  .readdirSync(postsDirectory)
  .filter(f => f.endsWith('.md'))
  .map(f => {
    const id = f.replace(/\.md$/, '')
    const { data, content } = matter(fs.readFileSync(path.join(postsDirectory, f), 'utf8'))
    return {
      id,
      slug: data.slug || id,
      title: data.title || id,
      date: data.date ? new Date(data.date) : null,
      excerpt: data.excerpt || excerptOf(content),
      draft: Boolean(data.draft),
    }
  })
  .filter(p => !p.draft && p.date)
  .sort((a, b) => b.date - a.date)

fs.mkdirSync(outDir, { recursive: true })

// sitemap
const sitemapItems = posts
  .map(p => `  <url><loc>${SITE_URL}/posts/${encodeURI(p.slug)}/</loc><lastmod>${p.date.toISOString()}</lastmod></url>`)
  .join('\n')
const staticPages = ['', 'archive/', 'categories/', 'tags/']
  .map(p => `  <url><loc>${SITE_URL}/${p}</loc></url>`)
  .join('\n')
fs.writeFileSync(
  path.join(outDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticPages}\n${sitemapItems}\n</urlset>\n`
)

// RSS 2.0
const rssItems = posts
  .map(
    p => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/posts/${encodeURI(p.slug)}/</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${encodeURI(p.slug)}/</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`
  )
  .join('\n')
fs.writeFileSync(
  path.join(outDir, 'feed.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n<title>EzTutorial - Kiang 技术笔记</title>\n<link>${SITE_URL}</link>\n<description>Kiang 的技术笔记、实践记录与工具教程</description>\n<language>zh-CN</language>\n${rssItems}\n</channel></rss>\n`
)

console.log(`[feeds] sitemap.xml (${posts.length} posts) + feed.xml generated into dist/`)

// posts.json：给主站 kiang.website 构建期拉取渲染「最新文章」板块用
const postsJson = posts.map(p => ({
  slug: p.slug,
  title: p.title,
  date: p.date.toISOString().slice(0, 10),
  excerpt: p.excerpt,
  url: `${SITE_URL}/posts/${encodeURI(p.slug)}/`,
}))
fs.writeFileSync(path.join(outDir, 'posts.json'), JSON.stringify(postsJson, null, 2))
console.log(`[feeds] posts.json (${postsJson.length} posts) generated into dist/`)
