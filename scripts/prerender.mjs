import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer, loadEnv } from 'vite'

const root = process.cwd()
const mode = process.env.MODE || 'production'
const env = loadEnv(mode, root, '')
const configuredUrl = env.VITE_SITE_URL
let siteUrl

if (configuredUrl) {
  const parsed = new URL(configuredUrl)
  if (parsed.protocol !== 'https:' || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('VITE_SITE_URL must be an HTTPS origin such as https://www.example.com')
  }
  siteUrl = parsed.origin
}

const vite = await createServer({ configFile: path.join(root, 'vite.config.ts'), server: { middlewareMode: true }, appType: 'custom', mode })

try {
  const [{ default: App }, { categories, questions }, { roadmapTopics }, { articles }] = await Promise.all([
    vite.ssrLoadModule('/src/App.tsx'),
    vite.ssrLoadModule('/src/features/questions/data.ts'),
    vite.ssrLoadModule('/src/features/roadmaps/data.ts'),
    vite.ssrLoadModule('/src/features/blog/data.ts'),
  ])
  const pages = [
    { path: '/' },
    { path: '/questions' },
    ...categories.map((category) => ({ path: `/questions/${category.slug}` })),
    ...questions.map((question) => {
      const category = categories.find((item) => item.id === question.categoryId)
      return { path: `/questions/${category.slug}/${question.slug}` }
    }),
    { path: '/roadmaps' },
    { path: '/roadmaps/ai-engineer-foundations' },
    ...roadmapTopics.map((topic) => ({ path: `/roadmaps/ai-engineer-foundations/${topic.slug}` })),
    { path: '/blog' },
    ...articles.map((article) => ({ path: `/blog/${article.slug}`, lastmod: article.updatedAt })),
    { path: '/about' },
  ]
  const template = await readFile(path.join(root, 'dist', 'index.html'), 'utf8')
  for (const page of pages) {
    const markup = renderToString(React.createElement(MemoryRouter, { initialEntries: [page.path] }, React.createElement(App)))
    const metadataPattern = /<title>[\s\S]*?<\/title>|<meta\s+[^>]*\/?>|<link rel="canonical"[^>]*\/?>/g
    const routeMetadata = markup.match(metadataPattern) ?? []
    const pageMarkup = markup.replace(metadataPattern, '')
    const cleanTemplate = template.replace(/<title>[\s\S]*?<\/title>|<meta name="(?:description|twitter:card|twitter:title|twitter:description|twitter:image)"[^>]*\/?>|<meta property="og:(?:title|description|type|url|image|image:alt)"[^>]*\/?>/g, '')
      .replace('</head>', `${routeMetadata.join('\n')}</head>`)
    const html = cleanTemplate.replace('<div id="root"></div>', `<div id="root" data-prerendered-path="${page.path}">${pageMarkup}</div>`)
    const target = page.path === '/' ? path.join(root, 'dist', 'index.html') : path.join(root, 'dist', page.path.slice(1), 'index.html')
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, html)
  }

  const missingRoute = '/__aitechprep_missing_route__'
  const notFoundMarkup = renderToString(React.createElement(MemoryRouter, { initialEntries: [missingRoute] }, React.createElement(App)))
  const metadataPattern = /<title>[\s\S]*?<\/title>|<meta\s+[^>]*\/?>|<link rel="canonical"[^>]*\/?>/g
  const notFoundMetadata = notFoundMarkup.match(metadataPattern) ?? []
  const cleanTemplate = template.replace(/<title>[\s\S]*?<\/title>|<meta name="(?:description|twitter:card|twitter:title|twitter:description|twitter:image)"[^>]*\/?>|<meta property="og:(?:title|description|type|url|image|image:alt)"[^>]*\/?>/g, '')
    .replace('</head>', `${notFoundMetadata.join('\n')}</head>`)
  const notFoundPage = cleanTemplate.replace('<div id="root"></div>', `<div id="root">${notFoundMarkup.replace(metadataPattern, '')}</div>`)
  await writeFile(path.join(root, 'dist', '404.html'), notFoundPage)

  const robotsPath = path.join(root, 'dist', 'robots.txt')
  let robots = 'User-agent: *\nAllow: /\nDisallow: /saved\nDisallow: /search\n'
  if (siteUrl) {
    robots += `Sitemap: ${siteUrl}/sitemap.xml\n`
    const entries = pages.map((page) => {
      const lastmod = page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''
      return `  <url><loc>${siteUrl}${page.path}</loc>${lastmod}</url>`
    }).join('\n')
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
    await writeFile(path.join(root, 'dist', 'sitemap.xml'), sitemap)
  } else {
    await rm(path.join(root, 'dist', 'sitemap.xml'), { force: true })
    console.warn('VITE_SITE_URL is not set; route-specific pages were prerendered, but sitemap.xml was not generated and canonical URLs are omitted. Set the production site origin to enable them.')
  }
  await writeFile(robotsPath, robots)
  console.log(`Pre-rendered ${pages.length} indexable routes${siteUrl ? ' and generated sitemap.xml' : ''}.`)
} finally {
  await vite.close()
}
