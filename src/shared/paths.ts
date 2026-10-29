import { categories } from '../features/questions/data'
import type { InterviewQuestion, RoadmapTopic } from '../types'

export const categoryFor = (id: string) => categories.find((category) => category.id === id)
export const questionPath = (question: InterviewQuestion) => `/questions/${categoryFor(question.categoryId)?.slug}/${question.slug}`
export const topicPath = (topic: RoadmapTopic) => `/roadmaps/ai-engineer-foundations/${topic.slug}`

