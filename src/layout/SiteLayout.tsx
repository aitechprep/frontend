import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, Search, Sparkles, X } from 'lucide-react'
import { useSaves } from '../saves'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { savedIds } = useSaves()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape') {
        setMobileOpen(false)
        searchRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function submitSearch(event: FormEvent) {
    event.preventDefault()
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search')
    setMobileOpen(false)
  }

  const links = [
    { to: '/', label: 'Explore', end: true },
    { to: '/questions', label: 'Questions' },
    { to: '/roadmaps', label: 'Roadmaps' },
    { to: '/blog', label: 'Blog & News' },
    { to: '/saved', label: 'Saved', count: savedIds.length },
    { to: '/about', label: 'About' },
  ]
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="AITechPrep home">
          <span className="brand-mark"><Sparkles size={21} /></span>
          <span className="brand-copy"><strong><span className="brand-ai">AI </span>TechPrep</strong><small>AI & TECH INTERVIEW PREP</small></span>
        </Link>
        <button className="icon-button mobile-menu-button" type="button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`primary-nav${mobileOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {links.map(({ to, label, end, count }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}>{label}{count !== undefined && <span className="nav-count">{count}</span>}</NavLink>
          ))}
          <form className="header-search" onSubmit={submitSearch} role="search">
            <Search size={16} aria-hidden="true" />
            <label className="sr-only" htmlFor="global-search">Search questions, topics, and articles</label>
            <input id="global-search" ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything" />
            <button type="submit" className="search-shortcut" aria-label="Submit search">/</button>
          </form>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="brand footer-brand" to="/" aria-label="AITechPrep home">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span className="brand-copy"><strong><span className="brand-ai">AI</span>TechPrep</strong><small>AI & TECH INTERVIEW PREP</small></span>
        </Link>
        <p>Clear concepts. Confident interviews.</p>
        <nav aria-label="Footer navigation">
          <Link to="/questions">Question bank</Link><Link to="/roadmaps">Roadmaps</Link><Link to="/blog">Blog & News</Link><Link to="/about">About</Link>
        </nav>
        <small className="copyright">© 2026 AITechPrep · Learning prototype</small>
      </div>
    </footer>
  )
}

export function Layout() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content"><Outlet /></main><Footer /></>
}
