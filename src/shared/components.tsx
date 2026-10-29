import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Bookmark, BookOpen, Check, Clock3, ChevronRight, Compass, Network, Sparkles } from 'lucide-react'
import { questions } from '../features/questions/data'
import { useSaves } from '../saves'
import type { Article, Category, InterviewQuestion } from '../types'
import { categoryFor, questionPath } from './paths'
import { JsonLd } from './JsonLd'
import { absoluteSiteUrl } from './seo'

export function PageMeta({ title, description, noindex = false, structuredData }: { title: string; description: string; noindex?: boolean; structuredData?: unknown }) {
  const { pathname } = useLocation()
  const canonical = absoluteSiteUrl(pathname)
  const schemaType = typeof structuredData === 'object' && structuredData !== null && '@type' in structuredData ? structuredData['@type'] : undefined
  const openGraphType = schemaType === 'Article' || schemaType === 'NewsArticle' ? 'article' : 'website'
  useEffect(() => {
    document.title = `AITechPrep | ${title}`
  }, [title])
  return <>
    <title>{`AITechPrep | ${title}`}</title>
    <meta name="description" content={description} />
    <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
    <meta property="og:title" content={`${title} | AITechPrep`} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={openGraphType} />
    {canonical.startsWith('http') && !noindex && <meta property="og:url" content={canonical} />}
    {canonical.startsWith('http') && !noindex && <>
      <meta property="og:image" content={absoluteSiteUrl('/og-image.png')} />
      <meta property="og:image:alt" content="AITechPrep — clear concepts, confident interviews." />
    </>}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={`${title} | AITechPrep`} />
    <meta name="twitter:description" content={description} />
    {canonical.startsWith('http') && !noindex && <meta name="twitter:image" content={absoluteSiteUrl('/og-image.png')} />}
    {canonical.startsWith('http') && !noindex && <link rel="canonical" href={canonical} />}
    {structuredData && <JsonLd data={structuredData} />}
  </>
}

export function IconTile({ category, large = false }: { category: Category; large?: boolean }) {
  return <span className={`icon-tile ${category.color}${large ? ' icon-tile-large' : ''}`} aria-hidden="true">{category.icon}</span>
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description: string }) {
  return <div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{description}</p></div>
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  const { pathname } = useLocation()
  const breadcrumbs = [{ label: 'Home', path: '/' }, ...items.map((item, index) => ({ label: item.label, path: item.to ?? (index === items.length - 1 ? pathname : undefined) }))]
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => {
      const itemUrl = absoluteSiteUrl(item.path ?? pathname)
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(itemUrl.startsWith('http') ? { item: itemUrl } : {}),
      }
    }),
  }
  return <><JsonLd data={structuredData} /><nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>{items.map((item, index) => <span className="breadcrumb-item" key={`${item.label}-${index}`}><ChevronRight size={14} aria-hidden="true" />{item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav></>
}

export function SaveButton({ question, compact = false }: { question: InterviewQuestion; compact?: boolean }) {
  const { savedIds, toggleSaved, storageError } = useSaves()
  const [feedback, setFeedback] = useState('')
  const saved = savedIds.includes(question.id)
  function toggle() {
    const success = toggleSaved(question.id)
    setFeedback(success ? (saved ? 'Removed from saved questions' : 'Question saved in this browser') : 'Question was not saved')
    window.setTimeout(() => setFeedback(''), 2800)
  }
  return <span className="save-control">
    <button className={`save-button${saved ? ' saved' : ''}${compact ? ' compact' : ''}`} type="button" onClick={toggle} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${question.title}`}>
      <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />{compact ? <span className="sr-only">{saved ? 'Saved' : 'Save'}</span> : saved ? 'Saved' : 'Save question'}
    </button>
    {(feedback || storageError) && <span className={`save-message${storageError ? ' error' : ''}`} role="status">{storageError || feedback}</span>}
  </span>
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return <span className={`difficulty ${difficulty.toLowerCase()}`}>{difficulty}</span>
}

export function QuestionCard({ question, index }: { question: InterviewQuestion; index?: number }) {
  const category = categoryFor(question.categoryId)
  if (!category) return null
  return <article className="question-card">
    <div className="question-card-top">
      <span className="question-number">{String((index ?? questions.indexOf(question)) + 1).padStart(2, '0')}</span>
      <div className="question-card-heading"><Link to={questionPath(question)}><h3>{question.title}</h3></Link><div className="question-meta"><span><Clock3 size={14} />{question.readingTime} min read</span><span className="meta-dot">·</span><Link to={`/questions/${category.slug}`}>{category.name}</Link></div></div>
      <DifficultyBadge difficulty={question.difficulty} />
    </div>
    <div className="short-answer"><p className="answer-label"><Check size={14} /> Interview-ready answer</p><p>{question.answer}</p></div>
    <div className="question-card-actions"><Link className="text-link" to={questionPath(question)}>Read the explanation <ArrowRight size={16} /></Link><SaveButton question={question} compact /></div>
  </article>
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-icon">{icon}</span><h2>{title}</h2><p>{description}</p>{action}</div>
}

export function Diagram({ question, compact = false }: { question: InterviewQuestion; compact?: boolean }) {
  const isComparison = question.visualType.toLowerCase().includes('comparison')
  const isCurve = question.visualType.toLowerCase().includes('curve')
  return <figure className={`diagram${compact ? ' diagram-compact' : ''}`}>
    {!compact && <figcaption className="diagram-caption"><span className="diagram-icon"><Network size={17} /></span><span><strong>{question.visualTitle}</strong><small>{question.visualObjective}</small></span><span className="diagram-type">{question.visualType}</span></figcaption>}
    {isCurve ? <div className="curve-chart"><svg viewBox="0 0 640 220" role="img" aria-label={question.visualAlt}><title>{question.visualAlt}</title><line x1="52" y1="180" x2="610" y2="180" /><line x1="52" y1="180" x2="52" y2="24" /><path className="curve-train" d="M55 45 C130 105 170 140 250 155 S430 173 600 178" /><path className="curve-valid" d="M55 48 C130 100 180 130 260 145 S410 148 600 150" /><path className="curve-overfit" d="M55 55 C150 115 205 145 280 150 C370 150 420 110 470 94 S555 76 600 72" /></svg><div className="chart-legend"><span><i className="legend-train" /> Training error</span><span><i className="legend-valid" /> Validation · generalizes</span><span><i className="legend-overfit" /> Validation · overfits</span></div><p className="chart-axis">Model training progresses →</p></div> : question.visualLanes?.length ? <div className="diagram-lanes">{question.visualLanes.map((lane) => <div className="diagram-lane" key={lane.label}><strong>{lane.label}</strong><div className="diagram-nodes">{lane.nodes.map((node, index) => <div className="diagram-node-wrap" key={`${lane.label}-${node.title}`}><div className="diagram-node"><span className="node-number">{String(index + 1).padStart(2, '0')}</span><strong>{node.title}</strong><small>{node.detail}</small></div>{index < lane.nodes.length - 1 && <ArrowRight className="diagram-arrow" size={18} aria-hidden="true" />}</div>)}</div></div>)}</div> : <div className={`diagram-nodes${isComparison ? ' comparison-nodes' : ''}`}>{question.visualNodes.map((node, index) => <div className="diagram-node-wrap" key={`${node.title}-${index}`}><div className="diagram-node"><span className="node-number">{String(index + 1).padStart(2, '0')}</span><strong>{node.title}</strong><small>{node.detail}</small></div>{index < question.visualNodes.length - 1 && !isComparison && <ArrowRight className="diagram-arrow" size={18} aria-hidden="true" />}</div>)}</div>}
    <p className="diagram-note"><Sparkles size={14} />{question.visualNote}</p>
    {!compact && <p className="diagram-alt sr-only">{question.visualAlt}</p>}
  </figure>
}

export function DetailSection({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: ReactNode }) {
  return <section className="detail-section" id={id}>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{children}</section>
}

export function CollectionComparisonTable() {
  const rows = [
    ['Ordering', 'Keeps insertion order', 'Keeps position order', 'No ordering contract', 'Keeps insertion order'],
    ['Can you change items?', 'Yes', 'No item reassignment', 'Yes: add/remove members', 'Yes: add/remove mappings'],
    ['Duplicates?', 'Allowed', 'Allowed', 'Values are unique', 'Keys are unique'],
    ['Best fit', 'Editable sequence', 'Fixed grouping', 'Membership / uniqueness', 'Key-to-value lookup'],
  ]
  return <div className="table-scroll"><table className="comparison-table"><caption className="sr-only">Comparison of Python lists, tuples, sets, and dictionaries</caption><thead><tr><th scope="col">Property</th><th scope="col">List</th><th scope="col">Tuple</th><th scope="col">Set</th><th scope="col">Dictionary</th></tr></thead><tbody>{rows.map(([property, ...values]) => <tr key={property}><th scope="row">{property}</th>{values.map((value, index) => <td key={`${property}-${index}`}>{value}</td>)}</tr>)}</tbody></table></div>
}

export function ArticleCard({ article }: { article: Article }) {
  return <Link className="article-card" to={`/blog/${article.slug}`}><div className="article-illustration"><div className="article-illustration-top"><BookOpen size={26} />{article.contentType === 'industry-news' && <span className="article-news-tag">News</span>}</div><span className="article-card-category">{article.category}</span></div><div className="article-card-body"><div className="article-meta"><span>{new Date(`${article.publishedAt}T12:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span><span>·</span><span>{article.readingTime} min read</span></div><h3>{article.title}</h3><p>{article.summary}</p><span className="text-link">Read article <ArrowRight size={15} /></span></div></Link>
}

export function NotFoundPage() {
  return <div className="page-width not-found"><PageMeta title="Page not found" description="The requested AITechPrep page could not be found." noindex /><span className="empty-icon"><Compass size={24} /></span><p className="eyebrow">404 · NOT FOUND</p><h1>This page isn't on the map.</h1><p>The link may be out of date, or this page may have moved.</p><Link to="/" className="button button-primary">Go to the home page <ArrowRight size={16} /></Link></div>
}
