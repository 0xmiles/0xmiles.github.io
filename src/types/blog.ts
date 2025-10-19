export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  coverImage?: string;
  author: {
    name: string;
    email: string;
  };
  readingTime: number;
  isPublished: boolean;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface BlogTag {
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogMetadata {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
}

export interface NotionPage {
  id: string;
  title: string;
  properties: Record<string, any>;
  content: string;
  lastEditedTime: string;
  createdTime: string;
}

export interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, any>;
}
