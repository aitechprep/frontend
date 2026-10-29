import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Lightbulb, Search } from 'lucide-react'
import { articles } from './data'
import { questions } from '../questions/data'
import { ArticleCard, Breadcrumbs, EmptyState, NotFoundPage, PageIntro, PageMeta } from '../../shared/components'
import { questionPath } from '../../shared/paths'
import { absoluteSiteUrl } from '../../shared/seo'
import type { InterviewQuestion } from '../../types'

export function BlogPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All topics')
  const choices = ['All topics', ...new Set(articles.map((article) => article.category))]
  const filtered = articles.filter((article) => (category === 'All topics' || article.category === category) && `${article.title} ${article.summary} ${article.category} ${article.body.map((section) => `${section.heading} ${section.paragraphs.join(' ')}`).join(' ')}`.toLowerCase().includes(search.toLowerCase()))
  return <div className="page-width content-page"><Breadcrumbs items={[{ label: 'Blog & News' }]} /><PageMeta title="Blog & News" description="Technical explainers and sourced, dated industry news." /><PageIntro eyebrow="THOUGHTFUL NOTES, NOT NOISE" title={<>Learn a little more<br /><span>every time you visit.</span></>} description="Practical explainers and sourced industry news, with clear context and dates." />
    <div className="blog-controls"><label className="filter-search"><Search size={16} /><span className="sr-only">Search articles</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles..." /></label><label className="select-label"><span className="sr-only">Filter articles by topic</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{choices.map((choice) => <option key={choice}>{choice}</option>)}</select></label></div>
    {filtered.length ? <div className="article-grid">{filtered.map((article) => <ArticleCard article={article} key={article.slug} />)}</div> : <EmptyState icon={<Search />} title="No articles found" description="Try a different phrase or choose another topic." action={<button className="button button-secondary" onClick={() => { setSearch(''); setCategory('All topics') }}>Clear filters</button>} />}
    <div className="editorial-note"><Check size={17} /><p><strong>Editorial note:</strong> News cards link to dated reporting. An announced offer or eligibility estimate is not the same as confirmed employee departures.</p></div>
  </div>
}

export function ArticlePage() {
  const { articleSlug } = useParams()
  const article = articles.find((item) => item.slug === articleSlug)
  if (!article) return <NotFoundPage />
  const relatedQuestions = article.relatedQuestionIds.map((id) => questions.find((item) => item.id === id)).filter((item): item is InterviewQuestion => Boolean(item))
  const articleUrl = absoluteSiteUrl(`/blog/${article.slug}`)
  const publisherUrl = absoluteSiteUrl('/')
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': article.contentType === 'industry-news' ? 'NewsArticle' : 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: article.author },
    publisher: { '@type': 'Organization', name: 'AITechPrep', ...(publisherUrl.startsWith('http') ? { url: publisherUrl } : {}) },
    ...(articleUrl.startsWith('http') ? { mainEntityOfPage: articleUrl } : {}),
    inLanguage: 'en',
    ...(article.sourceReferences?.length ? { citation: article.sourceReferences.map((source) => source.url) } : {}),
  }
  return <div className="page-width content-page article-detail-page"><Breadcrumbs items={[{ label: 'Blog & News', to: '/blog' }, { label: article.title }]} /><PageMeta title={article.title} description={article.summary} structuredData={articleSchema} /><article className="article-detail"><Link to="/blog" className="back-link"><ArrowLeft size={15} /> Back to Blog & News</Link><div className="article-detail-tags">{article.contentType === 'industry-news' && <span className="article-news-tag">News</span>}<span className="article-category">{article.category}</span></div><h1>{article.title}</h1><p className="article-summary">{article.summary}</p><div className="article-meta"><span>{article.author}</span><span>·</span><span>Published</span><time dateTime={article.publishedAt}>{new Date(`${article.publishedAt}T12:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</time><span>·</span><span>Updated</span><time dateTime={article.updatedAt}>{new Date(`${article.updatedAt}T12:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</time><span>·</span><span>{article.readingTime} min read</span></div>
    <div className="article-body">{article.body.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div><div className="editorial-note"><Lightbulb size={17} /><p>{article.contentType === 'industry-news' ? 'This report was updated October 28, 2026. The approximately 60,000 figure refers to eligibility; Microsoft had not reported how many employees would accept the offer.' : 'This is an evergreen educational article, not a report of current news. No external news claims are made.'}</p></div>
    {article.sourceReferences && article.sourceReferences.length > 0 && <section className="related-section"><h2>Sources and references</h2><ul className="prose-list">{article.sourceReferences.map((source) => { let safeUrl: string | null = null; try { const parsed = new URL(source.url); if (parsed.protocol === 'https:' || parsed.protocol === 'http:') safeUrl = parsed.href } catch { safeUrl = null } return <li key={source.url}>{safeUrl ? <a href={safeUrl} target="_blank" rel="noopener noreferrer">{source.title} — {source.publisher ?? 'Source'} <span className="sr-only">(opens in a new tab)</span></a> : <span>{source.title} — source link unavailable</span>}</li> })}</ul></section>}
    {relatedQuestions.length > 0 && <section className="related-section"><h2>Learn the related concepts</h2><div className="related-list">{relatedQuestions.map((question) => <Link to={questionPath(question)} key={question.id}>{question.title}<ArrowRight size={15} /></Link>)}</div></section>}</article></div>
}
