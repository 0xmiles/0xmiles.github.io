import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://0xmiles.github.io',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/admin/'),
      serialize(item) {
        // 홈 페이지는 priority 높게
        if (item.url === 'https://0xmiles.github.io/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        // 포스트는 priority 높게
        if (item.url.includes('/posts/') && !item.url.endsWith('/posts/')) {
          return { ...item, priority: 0.9, changefreq: 'monthly' };
        }
        // 카테고리 페이지
        if (item.url.includes('/category/')) {
          return { ...item, priority: 0.6, changefreq: 'weekly' };
        }
        return item;
      },
    }),
    mdx(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      langs: ['javascript', 'typescript', 'kotlin', 'java', 'python', 'sql', 'bash', 'yaml', 'json'],
      wrap: true,
    },
  },
  output: 'static',
  build: {
    assets: 'assets',
  },
});

