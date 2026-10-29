import { Routes, Route } from 'react-router-dom'
import { SavesProvider } from './state'
import { AboutPage } from './features/about/AboutPage'
import { BlogPage, ArticlePage } from './features/blog/BlogPages'
import { HomePage } from './features/home/HomePage'
import { Layout as SiteLayout } from './layout/SiteLayout'
import { QuestionListPage, QuestionDetailPage, SavedPage } from './features/questions/QuestionPages'
import { RoadmapsPage, RoadmapOverviewPage, TopicPage } from './features/roadmaps/RoadmapPages'
import { SearchPage } from './features/search/SearchPage'
import { NotFoundPage } from './shared/components'

export default function App() {
  return <SavesProvider><Routes><Route element={<SiteLayout />}><Route index element={<HomePage />} /><Route path="questions" element={<QuestionListPage />} /><Route path="questions/:categorySlug" element={<QuestionListPage />} /><Route path="questions/:categorySlug/:questionSlug" element={<QuestionDetailPage />} /><Route path="saved" element={<SavedPage />} /><Route path="roadmaps" element={<RoadmapsPage />} /><Route path="roadmaps/:roadmapSlug" element={<RoadmapOverviewPage />} /><Route path="roadmaps/:roadmapSlug/:topicSlug" element={<TopicPage />} /><Route path="blog" element={<BlogPage />} /><Route path="blog/:articleSlug" element={<ArticlePage />} /><Route path="search" element={<SearchPage />} /><Route path="about" element={<AboutPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes></SavesProvider>
}
