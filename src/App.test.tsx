import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

describe('AITechPrep journeys', () => {
  beforeEach(() => window.localStorage.clear())
  afterEach(() => cleanup())

  it('renders the six discovery tracks and the exact question bank count', () => {
    renderAt('/')
    expect(screen.getAllByRole('link', { name: 'AITechPrep home' })).toHaveLength(2)
    expect(screen.getByRole('heading', { name: /understand the concepts behind great technical interviews/i })).toBeInTheDocument()
    expect(screen.getAllByText(/2 questions/)).toHaveLength(6)
    expect(document.title).toMatch(/AITechPrep/)
  })

  it('filters the question list by difficulty and search', async () => {
    renderAt('/questions?difficulty=Beginner')
    expect(screen.getByText('Showing 5 of 12 questions')).toBeInTheDocument()
    const search = screen.getByRole('textbox', { name: 'Search questions' })
    fireEvent.change(search, { target: { value: 'overfitting' } })
    await waitFor(() => expect(screen.getByText('Showing 0 of 12 questions')).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText('Filter by difficulty'), { target: { value: 'All levels' } })
    await waitFor(() => expect(screen.getByText('Showing 1 of 12 questions')).toBeInTheDocument())
    expect(screen.getByRole('heading', { name: /overfitting/i })).toBeInTheDocument()
  })

  it('persists a saved question and exposes it on the saved page', () => {
    const first = renderAt('/questions/llms-generative-ai/what-is-an-llm')
    fireEvent.click(screen.getByRole('button', { name: /save what is a large language model/i }))
    expect(screen.getByRole('status')).toHaveTextContent('Question saved in this browser')
    first.unmount()
    renderAt('/saved')
    expect(screen.getByRole('heading', { name: /what is a large language model/i })).toBeInTheDocument()
    expect(window.localStorage.getItem('modelprep:savedQuestions:v1')).toContain('llm-basics')
    fireEvent.click(screen.getByRole('button', { name: /remove what is a large language model/i }))
    expect(screen.getByText('No saved questions yet.')).toBeInTheDocument()
  })

  it('shows the collection comparison table on the Python detail page', () => {
    renderAt('/questions/python-coding/python-list-tuple-set-dictionary')
    expect(screen.getByRole('table', { name: /comparison of python lists/i })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /duplicates/i })).toHaveTextContent('Values are unique')
  })

  it('exposes visible interview answers as FAQ structured data', () => {
    renderAt('/questions/llms-generative-ai/what-is-an-llm')
    const faq = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((script) => JSON.parse(script.textContent ?? '{}') as { '@type'?: string })
      .find((schema) => schema['@type'] === 'FAQPage')
    expect(faq).toBeDefined()
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', expect.stringContaining('A large language model'))
  })

  it('exposes dated editorial content as Article structured data', () => {
    renderAt('/blog/rag-through-a-practical-example')
    const article = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((script) => JSON.parse(script.textContent ?? '{}') as { '@type'?: string; headline?: string; datePublished?: string })
      .find((schema) => schema['@type'] === 'Article')
    expect(article).toMatchObject({
      headline: 'RAG, explained through a practical example',
      datePublished: '2026-10-27',
    })
  })

  it('marks saved and search pages as non-indexable', () => {
    renderAt('/search?q=RAG')
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  })

  it('renders the accessible mobile roadmap outline and opens a topic', () => {
    renderAt('/roadmaps/ai-engineer-foundations')
    const stages = screen.getByRole('list', { name: /roadmap learning stages/i })
    fireEvent.click(within(stages).getByRole('link', { name: /python & software foundations/i }))
    expect(screen.getByRole('heading', { name: /python & software foundations/i })).toBeInTheDocument()
    expect(screen.getByText('Learning objective')).toBeInTheDocument()
  })

  it('searches and opens an evergreen article', () => {
    renderAt('/search?q=RAG')
    const articleLink = screen.getByRole('link', { name: /rag, explained through a practical example/i })
    fireEvent.click(articleLink)
    expect(screen.getByRole('heading', { name: /rag, explained through a practical example/i })).toBeInTheDocument()
    expect(screen.getByText(/evergreen educational article/i)).toBeInTheDocument()
  })

  it('labels Microsoft workforce news and shows its dated sources', () => {
    renderAt('/blog')
    const newsCard = screen.getByRole('link', { name: /microsoft offers voluntary exit packages to about 60,000 employees/i })
    expect(within(newsCard).getByText('News')).toBeInTheDocument()
    fireEvent.click(newsCard)
    expect(screen.getByRole('heading', { name: /microsoft offers voluntary exit packages to about 60,000 employees/i })).toBeInTheDocument()
    expect(screen.getByText(/not a count of people who accepted it or retired/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /geekwire/i })).toHaveAttribute('href', 'https://www.geekwire.com/2026/microsoft-makes-new-voluntary-exit-offer-to-more-than-a-quarter-of-its-workforce-including-some-execs/')
    expect(screen.getByRole('link', { name: /microsoft: introducing a voluntary exit offer/i })).toHaveAttribute('href', 'https://blogs.microsoft.com/blog/2026/10/26/introducing-a-voluntary-exit-offer/')
  })

  it('shows a useful not-found page for unknown routes', () => {
    renderAt('/not-a-real-route')
    expect(screen.getByRole('heading', { name: /this page isn't on the map/i })).toBeInTheDocument()
  })
})
