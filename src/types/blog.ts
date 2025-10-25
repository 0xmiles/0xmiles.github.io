import { ExtendedRecordMap } from 'notion-types'

export interface BlogPost {
  id: string
  title: string
  slug: string
  description?: string
  cover?: string
  published: boolean
  publishedAt: string
  tags: string[]
  author: string
  content?: ExtendedRecordMap
}

export interface BlogPostPreview {
  id: string
  title: string
  slug: string
  description?: string
  cover?: string
  publishedAt: string
  tags: string[]
  author: string
}

export interface Tag {
  name: string
  count: number
}

export interface SearchResult {
  posts: BlogPost[]
  query: string
  total: number
}
