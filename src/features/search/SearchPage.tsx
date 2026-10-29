import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Network, Search } from 'lucide-react'
import { articles } from '../blog/data'
import { questions } from '../questions/data'
import { roadmapTopics } from '../roadmaps/data'
import { ArticleCard, Breadcrumbs, EmptyState, PageIntro, PageMeta, QuestionCard } from '../../shared/components'
import { categoryFor, topicPath } from '../../shared/paths'

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const term = query.toLowerCase()
  const matchedQuestions = questions.filter((question) => `${question.title} ${question.answer} ${question.tags.join(' ')} ${categoryFor(question.categoryId)?.name}`.toLowerCase().includes(term))
  const matchedTopics = roadmapTopics.filter((topic) => `${topic.title} ${topic.description} ${topic.concepts.join(' ')}`.toLowerCase().includes(term))
  const matchedArticles = articles.filter((article) => `${article.title} ${article.summary} ${article.category}`.toLowerCase().includes(term))
  const total = matchedQuestions.length + matchedTopics.length + matchedArticles.length
  return <div className="page-width content-page"><Breadcrumbs items={[{ label: 'Search' }]} /><PageMeta title={query ? `Search: ${query}` : 'Search'} description="Search AITechPrep questions, roadmap topics, and technical articles." noindex /><PageIntro eyebrow="SEARCH AITECHPREP" title={query ? <>Results for <span>“{query}”</span></> : 'Search the learning library.'} description="Search across interview questions, roadmap stages, and original technical articles." />
    {!query ? <EmptyState icon={<Search />} title="Start with a concept" description="Use the search field in the header to find a question, topic, or article." action={<Link to="/questions" className="button button-primary">Browse questions <ArrowRight size={16} /></Link>} /> : total ? <div className="search-results">
      {matchedQuestions.length > 0 && <section><div className="section-heading compact-heading"><div><p className="eyebrow">INTERVIEW QUESTIONS</p><h2>{matchedQuestions.length} results</h2></div></div><div className="question-list">{matchedQuestions.map((question) => <QuestionCard question={question} key={question.id} />)}</div></section>}
      {matchedTopics.length > 0 && <section><div className="section-heading compact-heading"><div><p className="eyebrow">ROADMAP TOPICS</p><h2>{matchedTopics.length} results</h2></div></div><div className="search-link-list">{matchedTopics.map((topic) => <Link to={topicPath(topic)} key={topic.slug}><span className="stage-icon"><Network size={17} /></span><span><strong>{topic.title}</strong><small>{topic.description}</small></span><ArrowRight size={16} /></Link>)}</div></section>}
      {matchedArticles.length > 0 && <section><div className="section-heading compact-heading"><div><p className="eyebrow">BLOG & NEWS</p><h2>{matchedArticles.length} results</h2></div></div><div className="article-grid">{matchedArticles.map((article) => <ArticleCard article={article} key={article.slug} />)}</div></section>}
    </div> : <EmptyState icon={<Search />} title="No matching content" description="Try another phrase or browse a track to explore what is available." action={<Link to="/questions" className="button button-secondary">Browse questions</Link>} />}
  </div>
}
