export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
}

export interface VisualNode {
  title: string
  detail: string
}

export interface VisualLane {
  label: string
  nodes: VisualNode[]
}

export interface LearningStep {
  title: string
  what: string
  why: string
}

export interface FollowUp {
  question: string
  answer: string
}

export interface InterviewQuestion {
  id: string
  slug: string
  title: string
  categoryId: string
  difficulty: Difficulty
  readingTime: number
  tags: string[]
  answer: string
  basicIdea: string
  analogy?: string
  visualTitle: string
  visualObjective: string
  visualType: string
  visualAlt: string
  visualNodes: VisualNode[]
  visualLanes?: VisualLane[]
  visualNote: string
  steps: LearningStep[]
  realWorldExample: string
  deepDive: string[]
  code?: string
  codeExplanation?: string
  useCases: string[]
  alternatives?: string
  mistakes: string[]
  limitations: string[]
  takeaways: string[]
  followUps: FollowUp[]
  spokenAnswer: string
  relatedQuestionIds: string[]
  relatedTopicSlugs: string[]
}

export interface RoadmapTopic {
  slug: string
  title: string
  stage: number
  description: string
  overview: string
  prerequisites: string[]
  objectives: string[]
  steps: LearningStep[]
  example: string
  exercises: string[]
  completionCriteria: string[]
  relatedQuestionIds: string[]
  nextTopicSlugs: string[]
  concepts: string[]
}

export interface Article {
  slug: string
  title: string
  category: string
  contentType: 'technical-blog' | 'industry-news'
  author: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  summary: string
  sourceReferences?: { title: string; url: string; publisher?: string; publishedAt?: string }[]
  body: { heading: string; paragraphs: string[] }[]
  relatedQuestionIds: string[]
  relatedTopicSlugs: string[]
}
