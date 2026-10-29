import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, ChevronRight, Clock3, Code2, Filter, Lightbulb, Search, Sparkles, X } from 'lucide-react'
import { categories, questions } from './data'
import { roadmapTopics } from '../roadmaps/data'
import { Breadcrumbs, CollectionComparisonTable, DetailSection, Diagram, DifficultyBadge, EmptyState, IconTile, NotFoundPage, PageIntro, PageMeta, QuestionCard, SaveButton } from '../../shared/components'
import { categoryFor, questionPath, topicPath } from '../../shared/paths'
import { useSaves } from '../../saves'
import type { InterviewQuestion } from '../../types'

export function QuestionListPage() {
  const { categorySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = categorySlug ? categories.find((item) => item.slug === categorySlug) : undefined
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') ?? 'All levels')
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  useEffect(() => {
    if (categorySlug && !category) return
    const params = new URLSearchParams()
    if (search.trim()) params.set('q', search)
    if (difficulty !== 'All levels') params.set('difficulty', difficulty)
    setSearchParams(params, { replace: true })
  }, [categorySlug, category, difficulty, search, setSearchParams])
  if (categorySlug && !category) return <NotFoundPage />
  const filtered = questions.filter((question) => {
    const matchesCategory = !category || question.categoryId === category.id
    const matchesDifficulty = difficulty === 'All levels' || question.difficulty === difficulty
    const term = search.trim().toLowerCase()
    const matchesSearch = !term || `${question.title} ${question.answer} ${question.tags.join(' ')}`.toLowerCase().includes(term)
    return matchesCategory && matchesDifficulty && matchesSearch
  })
  return <div className="page-width content-page">
    <Breadcrumbs items={category ? [{ label: 'Questions', to: '/questions' }, { label: category.name }] : [{ label: 'Questions' }]} />
    <PageMeta title={category?.name ? `${category.name} Interview Questions` : 'Technical Interview Question Bank'} description={category?.description ?? 'Browse practical AI, machine-learning, Python, data-engineering, and system-design interview questions with concise answers and visual explanations.'} />
    <PageIntro eyebrow={category ? `YOUR TRACK · ${filtered.length} QUESTIONS` : 'QUESTION BANK · 12 QUESTIONS'} title={category?.name ?? 'A better way to prepare.'} description={category?.description ?? 'Find the question, understand the concept, and build an answer you can explain in your own words.'} />
    <div className="question-layout"><aside className="track-sidebar"><p className="sidebar-label">YOUR TRACKS</p>{categories.map((item) => <Link className={`track-link${category?.id === item.id ? ' active' : ''}`} to={`/questions/${item.slug}`} key={item.id}><IconTile category={item} />{item.name}<span>{questions.filter((question) => question.categoryId === item.id).length}</span></Link>)}<div className="tip-card"><Lightbulb size={18} /><strong>Interview tip</strong><p>Try answering out loud before reading the explanation. You'll learn what needs practice.</p></div></aside>
      <section className="question-results" aria-label="Question results">
        <div className="filter-bar"><label className="filter-search"><Search size={16} /><span className="sr-only">Search questions</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search questions or concepts..." /></label><label className="select-label"><Filter size={15} /><span className="sr-only">Filter by difficulty</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option>All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label></div>
        <div className="results-caption"><span>Showing {filtered.length} of {category ? questions.filter((question) => question.categoryId === category.id).length : questions.length} questions</span>{(search || difficulty !== 'All levels') && <button className="plain-button" type="button" onClick={() => { setSearch(''); setDifficulty('All levels') }}>Clear filters</button>}</div>
        {filtered.length ? <div className="question-list">{filtered.map((question) => <QuestionCard key={question.id} question={question} />)}</div> : <EmptyState icon={<Search />} title="No questions found" description="Try a different search or clear the current filters." action={<button className="button button-secondary" type="button" onClick={() => { setSearch(''); setDifficulty('All levels') }}>Clear filters</button>} />}
      </section>
    </div>
  </div>
}

export function QuestionDetailPage() {
  const { categorySlug, questionSlug } = useParams()
  const question = questions.find((item) => item.slug === questionSlug && categoryFor(item.categoryId)?.slug === categorySlug)
  if (!question) return <NotFoundPage />
  const category = categoryFor(question.categoryId)!
  const related = question.relatedQuestionIds.map((id) => questions.find((item) => item.id === id)).filter((item): item is InterviewQuestion => Boolean(item))
  const previous = questions[questions.indexOf(question) - 1]
  const next = questions[questions.indexOf(question) + 1]
  const toc = [{ id: 'basics', label: 'The basic idea' }, { id: 'visual', label: 'Visual explanation' }, { id: 'steps', label: 'How it works' }, { id: 'example', label: 'A practical example' }, { id: 'deep-dive', label: 'Technical deep dive' }, { id: 'takeaways', label: 'Key takeaways' }, { id: 'follow-ups', label: 'Follow-up questions' }]
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: question.title, acceptedAnswer: { '@type': 'Answer', text: question.answer } },
      ...question.followUps.map((followUp) => ({ '@type': 'Question', name: followUp.question, acceptedAnswer: { '@type': 'Answer', text: followUp.answer } })),
    ],
  }
  return <div className="page-width detail-page">
    <Breadcrumbs items={[{ label: category.name, to: `/questions/${category.slug}` }, { label: question.title }]} />
    <PageMeta title={question.title} description={question.answer} structuredData={structuredData} />
    <div className="detail-grid"><article className="question-article">
      <Link to={`/questions/${category.slug}`} className="back-link"><ArrowLeft size={15} /> Back to {category.name}</Link>
      <p className="eyebrow detail-kicker">{category.name.toUpperCase()} · QUESTION {String(questions.indexOf(question) + 1).padStart(2, '0')}</p>
      <div className="detail-heading"><h1>{question.title}</h1><SaveButton question={question} /></div>
      <details className="mobile-toc"><summary>On this page <ChevronRight size={15} /></summary><nav aria-label="Question page sections"><a href="#interview-answer">Interview-ready answer</a>{toc.map((item) => <a href={`#${item.id}`} key={item.id}>{item.label}</a>)}</nav></details>
      <div className="detail-meta"><DifficultyBadge difficulty={question.difficulty} /><span><Clock3 size={15} /> {question.readingTime} min read</span></div>
      <div className="interview-answer" id="interview-answer"><div className="interview-answer-title"><Check size={16} /><span><strong>Interview-ready answer</strong><small>The concise version to remember</small></span></div><p>{question.answer}</p></div>
      <DetailSection id="basics" eyebrow="LET'S MAKE IT SIMPLE" title="First, the idea in plain English"><p>{question.basicIdea}</p>{question.analogy && <div className="analogy-card"><span className="analogy-icon"><Lightbulb size={20} /></span><div><p className="eyebrow">A USEFUL COMPARISON</p><h3>Picture it this way</h3><p>{question.analogy}</p></div></div>}</DetailSection>
      <DetailSection id="visual" eyebrow="FOLLOW THE JOURNEY" title={question.visualTitle}><p className="section-lead">{question.visualObjective}</p><Diagram question={question} /><p className="how-read"><strong>How to read this visual</strong><br />{question.visualNote}</p></DetailSection>
      <DetailSection id="steps" eyebrow="UNDER THE HOOD" title="How it works, step by step"><div className="steps-list">{question.steps.map((step, index) => <div className="learning-step" key={step.title}><span className="step-count">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.what}</p><p className="why-it-matters"><strong>Why it matters:</strong> {step.why}</p></div></div>)}</div></DetailSection>
      <DetailSection id="example" eyebrow="OUTSIDE THE TEXTBOOK" title="A practical example"><div className="example-card"><span className="icon-tile green"><BookOpen size={19} /></span><p>{question.realWorldExample}</p></div></DetailSection>
      <DetailSection id="deep-dive" eyebrow="GO A LITTLE DEEPER" title="Technical details that matter"><ul className="prose-list">{question.deepDive.map((item) => <li key={item}>{item}</li>)}</ul>{question.id === 'python-collections' && <><h3 className="subheading">Compare the collection types</h3><CollectionComparisonTable /></>}{question.code && <div className="code-example"><div className="code-heading"><Code2 size={16} />{question.categoryId === 'python' ? 'Python example' : 'Simplified request contract'}</div><pre><code>{question.code}</code></pre>{question.codeExplanation && <p>{question.codeExplanation}</p>}</div>}</DetailSection>
      <DetailSection id="when-to-use" eyebrow="MAKE A GOOD CHOICE" title="When is this useful?"><ul className="prose-list">{question.useCases.map((item) => <li key={item}>{item}</li>)}</ul>{question.alternatives && <div className="note-card"><strong>Consider the alternative</strong><p>{question.alternatives}</p></div>}</DetailSection>
      <DetailSection id="mistakes" eyebrow="WATCH OUT FOR" title="Common misunderstandings"><ul className="mistake-list">{question.mistakes.map((item) => <li key={item}><X size={15} />{item}</li>)}</ul></DetailSection>
      <DetailSection id="limitations" eyebrow="REAL-WORLD TRADE-OFFS" title="Limitations and failure cases"><ul className="prose-list">{question.limitations.map((item) => <li key={item}>{item}</li>)}</ul></DetailSection>
      <DetailSection id="takeaways" eyebrow="WHAT TO REMEMBER" title="Key takeaways"><ol className="takeaway-list">{question.takeaways.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></DetailSection>
      <DetailSection id="follow-ups" eyebrow="PRACTICE THE FOLLOW-UP" title="What might an interviewer ask next?"><div className="followup-list">{question.followUps.map((item) => <details className="followup" key={item.question}><summary>{item.question}<ChevronRight size={16} /></summary><p>{item.answer}</p></details>)}</div></DetailSection>
      <section className="spoken-answer"><p className="eyebrow">SAY IT OUT LOUD</p><h2>How to explain this in an interview</h2><p>“{question.spokenAnswer}”</p></section>
      {question.relatedTopicSlugs.length > 0 && <div className="continue-card"><Sparkles size={18} /><div><strong>Continue your learning path</strong><p>Connect this question to the roadmap topic it supports.</p></div><Link to={topicPath(roadmapTopics.find((topic) => topic.slug === question.relatedTopicSlugs[0])!)} className="text-link">Open roadmap topic <ArrowRight size={16} /></Link></div>}
      {related.length > 0 && <section className="related-section"><h2>Keep exploring</h2><div className="related-list">{related.map((item) => <Link to={questionPath(item)} key={item.id}>{item.title}<ArrowRight size={15} /></Link>)}</div></section>}
      <div className="detail-pager">{previous ? <Link to={questionPath(previous)}><ArrowLeft size={16} /><span><small>PREVIOUS QUESTION</small>{previous.title}</span></Link> : <span />}{next ? <Link to={questionPath(next)} className="next-pager"><span><small>NEXT QUESTION</small>{next.title}</span><ArrowRight size={16} /></Link> : <Link to="/questions" className="text-link">Back to questions <ArrowRight size={16} /></Link>}</div>
    </article>
    <aside className="detail-sidebar"><div className="toc-card"><p className="sidebar-label">ON THIS PAGE</p><a className="toc-anchor" href="#basics">Interview-ready answer</a>{toc.map((item) => <a className="toc-anchor" href={`#${item.id}`} key={item.id}>{item.label}</a>)}<div className="toc-divider" /><Link to={`/questions/${category.slug}`} className="text-link">Browse this track <ArrowRight size={15} /></Link></div><div className="sidebar-encouragement"><Sparkles size={19} /><h3>Learn it. Say it. Own it.</h3><p>Try explaining the idea aloud before you move to the next question.</p></div></aside></div>
  </div>
}

export function SavedPage() {
  const { savedIds } = useSaves()
  const saved = savedIds.map((id) => questions.find((question) => question.id === id)).filter((question): question is InterviewQuestion => Boolean(question))
  return <div className="page-width content-page saved-page"><Breadcrumbs items={[{ label: 'Saved questions' }]} /><PageMeta title="Saved questions" description="Return to the technical interview questions you bookmarked in this browser." noindex /><PageIntro eyebrow="YOUR REVISION LIST" title={<>Keep the important<br /><span>ones close.</span></>} description="Questions you bookmark are stored in this browser, so you can return to them during revision." />
    {saved.length ? <><div className="privacy-note"><Bookmark size={16} /> Saved on this browser and device only. Bookmarks do not sync across devices.</div><div className="question-list">{saved.map((question) => <QuestionCard question={question} key={question.id} />)}</div></> : <EmptyState icon={<Bookmark size={23} />} title="No saved questions yet." description="Bookmark useful questions while you learn. They'll appear here so you can revisit them whenever you need." action={<Link to="/questions" className="button button-primary">Explore questions <ArrowRight size={16} /></Link>} />}
  </div>
}
