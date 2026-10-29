import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Clock3, Network, Search, Target } from 'lucide-react'
import { articles } from '../blog/data'
import { categories, questions } from '../questions/data'
import { ArticleCard, Diagram, DifficultyBadge, IconTile, PageMeta } from '../../shared/components'
import { categoryFor, questionPath } from '../../shared/paths'
import { absoluteSiteUrl } from '../../shared/seo'

export function HomePage() {
  const navigate = useNavigate()
  const featured = [questions[0], questions[10], questions[1]]
  const siteUrl = absoluteSiteUrl('/')
  return <>
    <PageMeta title="AI & Tech Interview Preparation" description="Prepare for AI and technical interviews with concise answers, visual explanations, practical examples, and a structured AI engineering roadmap." structuredData={{
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AITechPrep',
      description: 'Visual-first AI and technical interview preparation with clear answers, practical explanations, and learning roadmaps.',
      ...(siteUrl.startsWith('http') ? { url: siteUrl, publisher: { '@type': 'Organization', name: 'AITechPrep', url: siteUrl } } : {}),
    }} />
    <section className="home-hero page-width">
      <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot" /> YOUR AI INTERVIEW COMPANION</p><h1 aria-label="Understand the concepts behind great technical interviews">Understand the concepts<br /><span>behind great technical interviews.</span></h1><p className="hero-description">Learn difficult technical topics through clear explanations, meaningful visuals, practical examples, and a structured learning roadmap.</p>
        <form className="hero-search" role="search" onSubmit={(event) => { event.preventDefault(); const value = new FormData(event.currentTarget).get('q')?.toString().trim(); navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/questions') }}>
          <Search size={18} /><label className="sr-only" htmlFor="hero-search">Search questions, concepts, or topics</label><input id="hero-search" name="q" placeholder="Search questions, concepts, or topics..." /><button className="button button-primary" type="submit">Search <ArrowRight size={16} /></button>
        </form>
        <div className="hero-actions"><Link to="/questions" className="button button-primary">Explore questions <ArrowRight size={16} /></Link><Link to="/roadmaps" className="button button-secondary"><Network size={16} /> Explore roadmap</Link></div>
        <p className="hero-note"><span className="avatar-stack"><i>AI</i><i>ML</i><i>DS</i></span><span><strong>12 carefully selected questions</strong><small>Six focused tracks · No account needed</small></span></p>
      </div>
      <div className="hero-art" aria-label="Illustration of a question becoming a clear, grounded answer">
        <div className="art-sparkle">✳</div><div className="concept-card"><div className="concept-eyebrow"><span /> CONCEPT IN FOCUS</div><h2>From question<br />to grounded answer</h2><div className="mini-flow">{['Question', 'Context', 'Model', 'Answer'].map((step, index) => <span className={`mini-step step-${index}`} key={step}><small>0{index + 1}</small>{step}</span>)}</div><p>A simplified flow of information</p></div>
        <div className="floating-card card-track"><IconTile category={categories[0]} /><span><strong>LLMs & GenAI</strong><small>Understand the why</small></span><Check size={15} /></div>
        <div className="floating-card card-ready"><span className="ready-icon"><Target size={17} /></span><span><strong>Interview-ready</strong><small>Short answer + deep dive</small></span></div><div className="art-star">✦</div>
      </div>
    </section>
    <div className="value-strip"><div className="page-width value-items"><span><Check /> Clear, concise answers</span><span><Check /> Visual explanations</span><span><Check /> Real-world trade-offs</span><span><Check /> Built for quick revision</span></div></div>
    <section className="page-width section-block">
      <div className="section-heading"><div><p className="eyebrow">CHOOSE YOUR TRACK</p><h2>Learn the concepts that <span>move you forward.</span></h2><p>Start with a topic, scan interview-ready answers, and dive deeper when you need to.</p></div><Link className="text-link" to="/questions">Browse all questions <ArrowRight size={16} /></Link></div>
      <div className="category-grid">{categories.map((category, index) => <Link className="category-card" to={`/questions/${category.slug}`} key={category.id}><div className="category-card-top"><IconTile category={category} /><span className="category-index">{String(index + 1).padStart(2, '0')}</span><span className="question-count">{questions.filter((question) => question.categoryId === category.id).length} questions</span></div><h3>{category.name}</h3><p>{category.description}</p><span className="text-link">Explore track <ArrowRight size={15} /></span></Link>)}</div>
    </section>
    <section className="learning-band"><div className="page-width learning-content"><div><p className="eyebrow">BUILT FOR REAL INTERVIEWS</p><h2>Don't just memorize.<br /><span>Make it click.</span></h2><p>Every question starts with a concise answer you can actually say in an interview. A visual makes the idea easier to grasp. A deeper guide helps you explain the trade-offs.</p><ul className="check-list"><li><Check /> <span><strong>Answer first</strong><small>Get the core idea in under a minute.</small></span></li><li><Check /> <span><strong>See the concept</strong><small>Use diagrams, flows, and comparisons to build intuition.</small></span></li><li><Check /> <span><strong>Go deeper on your terms</strong><small>Open detailed explanations only when you need them.</small></span></li></ul><Link to={questionPath(questions[0])} className="button button-primary">Try a question <ArrowRight size={16} /></Link></div><article className="feature-answer"><div className="feature-answer-meta"><span>QUESTION 01</span><DifficultyBadge difficulty="Intermediate" /></div><h3>{questions[1].title}</h3><p>{questions[1].answer}</p><Diagram question={questions[1]} compact /><Link className="text-link" to={questionPath(questions[1])}>View detailed answer <ArrowRight size={16} /></Link></article></div></section>
    <section className="page-width featured-section"><div className="section-heading"><div><p className="eyebrow">START LEARNING</p><h2>Questions worth understanding.</h2><p>Explore a sample from the twelve-question starter library.</p></div><Link to="/questions" className="text-link">All questions <ArrowRight size={16} /></Link></div><div className="featured-grid">{featured.map((question) => <Link to={questionPath(question)} className="featured-question" key={question.id}><span>{categoryFor(question.categoryId)?.name}</span><h3>{question.title}</h3><small><Clock3 size={13} /> {question.readingTime} min read <ArrowRight size={15} /></small></Link>)}</div></section>
    <section className="roadmap-cta"><div className="page-width roadmap-cta-inner"><span className="icon-tile blue"><Network /></span><div><p className="eyebrow">NOT SURE WHERE TO START?</p><h2>Follow a path, not a pile of tabs.</h2><p>Use a structured roadmap to move from foundations to production-ready thinking.</p></div><Link to="/roadmaps" className="button button-primary">Explore roadmap <ArrowRight size={16} /></Link></div></section>
    <section className="page-width blog-preview"><div className="section-heading"><div><p className="eyebrow">IDEAS TO TAKE FURTHER</p><h2>Learn beyond the interview.</h2><p>Original, practical notes on building a stronger engineering foundation.</p></div><Link to="/blog" className="text-link">Visit Blog & News <ArrowRight size={16} /></Link></div><div className="article-grid">{articles.slice(0, 2).map((article) => <ArticleCard article={article} key={article.slug} />)}</div></section>
  </>
}
