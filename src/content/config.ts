import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['web', 'backend', 'devops', 'database', 'algorithms', 'architecture']),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    author: z.string().default('0xmiles'),
    canonicalUrl: z.string().url().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};

