import { describe, expect, it } from 'vitest'
import { articles, categories, questions, roadmapTopics } from './content'

describe('starter library content', () => {
  it('contains exactly two questions in each of six categories', () => {
    expect(categories).toHaveLength(6)
    expect(questions).toHaveLength(12)
    expect(categories.map((category) => category.name)).toEqual([
      'LLMs & Generative AI',
      'Machine Learning',
      'MLOps & Deployment',
      'Python & Coding',
      'Data Engineering',
      'System Design',
    ])
    expect(questions.map((question) => question.title)).toEqual([
      'What is a Large Language Model (LLM), and how does it work?',
      'What is Retrieval-Augmented Generation (RAG), and when should you use it?',
      'What is the difference between supervised, unsupervised, and reinforcement learning?',
      'What is overfitting, and how can you prevent it?',
      'What is MLOps, and why is it important?',
      'What is model drift, and how can you detect and address it?',
      'What is the difference between a list, tuple, set, and dictionary in Python?',
      'How do you find duplicate characters in a string in Python?',
      'What is the difference between ETL and ELT?',
      'What is a data pipeline, and how would you design a reliable one?',
      'How would you design a URL-shortening service?',
      'How would you design a rate limiter?',
    ])
    for (const category of categories) {
      expect(questions.filter((question) => question.categoryId === category.id), category.name).toHaveLength(2)
    }
  })

  it('uses unique, stable question identifiers and resolvable relationships', () => {
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length)
    expect(new Set(questions.map((question) => question.slug)).size).toBe(questions.length)
    for (const question of questions) {
      expect(categories.some((category) => category.id === question.categoryId), question.id).toBe(true)
      expect(question.relatedQuestionIds.every((id) => questions.some((item) => item.id === id)), question.id).toBe(true)
      expect(question.relatedTopicSlugs.every((slug) => roadmapTopics.some((topic) => topic.slug === slug)), question.id).toBe(true)
      const answerWords = question.answer.split(/\s+/).length
      expect(answerWords, question.id).toBeGreaterThanOrEqual(40)
      expect(answerWords, question.id).toBeLessThanOrEqual(85)
      expect(question.visualNodes.length, question.id).toBeGreaterThanOrEqual(2)
      expect(question.visualAlt.length, question.id).toBeGreaterThan(30)
      expect(question.followUps.length, question.id).toBeGreaterThanOrEqual(2)
    }
  })

  it('has one populated seven-stage roadmap and articles linked to valid content', () => {
    expect(roadmapTopics).toHaveLength(7)
    expect(roadmapTopics.map((topic) => topic.stage)).toEqual([1, 2, 3, 4, 5, 6, 7])
    for (const topic of roadmapTopics) {
      expect(topic.steps.length, topic.slug).toBeGreaterThan(0)
      expect(topic.exercises.length, topic.slug).toBeGreaterThan(0)
      expect(topic.relatedQuestionIds.every((id) => questions.some((question) => question.id === id)), topic.slug).toBe(true)
      expect(topic.nextTopicSlugs.every((slug) => roadmapTopics.some((item) => item.slug === slug)), topic.slug).toBe(true)
    }
    expect(articles.length).toBeGreaterThanOrEqual(3)
    for (const article of articles) {
      expect(article.body.length, article.slug).toBeGreaterThan(0)
      expect(article.author, article.slug).not.toBe('')
      expect(Number.isNaN(Date.parse(article.publishedAt)), article.slug).toBe(false)
      expect(Number.isNaN(Date.parse(article.updatedAt)), article.slug).toBe(false)
      expect(article.relatedQuestionIds.every((id) => questions.some((question) => question.id === id)), article.slug).toBe(true)
      expect(article.relatedTopicSlugs.every((slug) => roadmapTopics.some((topic) => topic.slug === slug)), article.slug).toBe(true)
      if (article.contentType === 'industry-news') {
        expect(article.sourceReferences?.length, article.slug).toBeGreaterThan(0)
        expect(article.sourceReferences?.every((source) => source.url.startsWith('https://')), article.slug).toBe(true)
      }
    }
    expect(articles.some((article) => article.slug === 'microsoft-voluntary-exit-offer-60000-employees' && article.contentType === 'industry-news')).toBe(true)
  })
})
