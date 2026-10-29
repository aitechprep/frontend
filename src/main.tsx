import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('The application root element is missing.')

const app = <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>
if (rootElement.dataset.prerenderedPath === window.location.pathname) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
