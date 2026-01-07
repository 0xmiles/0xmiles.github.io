import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://0xmiles.github.io',
  integrations: [
    tailwind(),
    sitemap(),
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

