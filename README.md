# 0xmiles Technical Blog

A modern, SEO-optimized technical blog built with Astro and hosted on GitHub Pages. Features a headless CMS for easy content management without manual git operations.

## 🚀 Features

- ✅ **SEO-Optimized**: Meta tags, Open Graph, Twitter Cards, structured data, sitemap, RSS feed
- ✅ **Markdown-First**: Write posts in Markdown with frontmatter validation
- ✅ **Headless CMS**: Edit posts via web UI at `/admin` (Decap CMS)
- ✅ **Zero JavaScript**: Static HTML for optimal performance
- ✅ **Dark Mode**: Automatic dark mode support
- ✅ **Responsive Design**: Mobile-first, accessible design
- ✅ **Type-Safe**: TypeScript with Zod schema validation
- ✅ **Auto-Deploy**: GitHub Actions deployment on push

## 📁 Project Structure

```
0xmiles.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment
├── public/
│   ├── admin/
│   │   ├── config.yml             # Decap CMS configuration
│   │   └── index.html             # CMS entry point
│   ├── images/                    # Static images
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BaseHead.astro         # SEO meta tags
│   │   ├── Header.astro           # Site header with navigation
│   │   ├── Footer.astro           # Site footer
│   │   ├── PostCard.astro         # Post preview card
│   │   └── CategoryList.astro     # Category display
│   ├── content/
│   │   ├── config.ts              # Content collections schema
│   │   └── posts/                 # Blog posts (Markdown)
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Base page layout
│   │   └── PostLayout.astro       # Blog post layout
│   ├── pages/
│   │   ├── index.astro            # Home page
│   │   ├── posts/
│   │   │   ├── index.astro        # All posts page
│   │   │   └── [slug].astro       # Individual post page
│   │   ├── category/
│   │   │   └── [category].astro   # Category pages
│   │   └── rss.xml.ts             # RSS feed generator
│   ├── styles/
│   │   └── global.css             # Global styles
│   └── utils/
│       └── seo.ts                 # SEO helper functions
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:4321` to see your blog.

### 3. Configure GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to **Pages** section
3. Under **Source**, select **GitHub Actions**
4. The site will auto-deploy on every push to `main`

### 4. Set Up Decap CMS (Optional but Recommended)

To enable the web-based CMS editor at `/admin`:

#### Option A: Using Netlify Identity (Recommended)

1. Sign up for a free [Netlify](https://www.netlify.com/) account
2. Create a new site (you can use it just for authentication)
3. Go to **Site Settings** → **Identity** → **Enable Identity**
4. Under **Identity** → **Settings**:
   - Enable **Git Gateway**
   - Set registration to **Invite only** (for security)
5. Update `public/admin/config.yml` if needed (current config uses git-gateway)
6. Invite yourself via Netlify Identity dashboard
7. Visit `https://yourusername.github.io/admin` to access the CMS

#### Option B: GitHub OAuth (Advanced)

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create a new OAuth App:
   - Homepage URL: `https://yourusername.github.io`
   - Authorization callback: `https://api.netlify.com/auth/done`
3. Update `public/admin/config.yml` with your OAuth credentials

### 5. Customize for Your Site

Update these files with your information:

- `astro.config.mjs`: Change `site` to your GitHub Pages URL
- `src/components/BaseHead.astro`: Update site name and social handles
- `src/components/Footer.astro`: Update links and copyright
- `src/pages/index.astro`: Customize hero section and about text
- `public/admin/config.yml`: Adjust CMS configuration if needed
- `public/robots.txt`: Update sitemap URL

## 📝 Writing Posts

### Via Decap CMS (Web UI)

1. Visit `https://yourusername.github.io/admin`
2. Log in with Netlify Identity
3. Click "New Post"
4. Fill in the fields and write your content
5. Click "Publish" - it will auto-commit to your repo

### Via Markdown Files

1. Create a new `.md` file in `src/content/posts/`
2. Add frontmatter:

```markdown
---
title: "Your Post Title"
description: "A brief description of your post"
date: 2026-01-07
category: backend
tags:
  - kotlin
  - spring-boot
draft: false
featured: false
author: 0xmiles
---

# Your Content Here

Write your post content in Markdown...
```

3. Commit and push to GitHub
4. GitHub Actions will automatically build and deploy

## 📊 Content Schema

Each post supports these frontmatter fields:

| Field          | Type    | Required | Description                                                      |
| -------------- | ------- | -------- | ---------------------------------------------------------------- |
| `title`        | string  | ✅       | Post title                                                       |
| `description`  | string  | ✅       | SEO description                                                  |
| `date`         | date    | ✅       | Publication date                                                 |
| `updated`      | date    | ❌       | Last updated date                                                |
| `category`     | enum    | ✅       | One of: web, backend, devops, database, algorithms, architecture |
| `tags`         | array   | ✅       | Post tags (min 1)                                                |
| `draft`        | boolean | ✅       | If true, post won't be published                                 |
| `featured`     | boolean | ✅       | Show in featured section                                         |
| `image`        | string  | ❌       | Cover image URL                                                  |
| `imageAlt`     | string  | ❌       | Image alt text                                                   |
| `author`       | string  | ✅       | Author name (default: 0xmiles)                                   |
| `canonicalUrl` | string  | ❌       | Canonical URL if cross-posted                                    |

## 🎨 Customization

### Adding New Categories

1. Update `src/content/config.ts`:

```typescript
category: z.enum(['web', 'backend', 'devops', 'database', 'algorithms', 'architecture', 'yournewcategory']),
```

2. Add color in `src/utils/seo.ts`:

```typescript
const colors: Record<string, string> = {
  // ... existing colors
  yournewcategory:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};
```

3. Update `public/admin/config.yml`:

```yaml
options:
  [
    "web",
    "backend",
    "devops",
    "database",
    "algorithms",
    "architecture",
    "yournewcategory",
  ]
```

### Styling

- Global styles: `src/styles/global.css`
- Tailwind config: `tailwind.config.mjs`
- Component-specific styles: Inline in `.astro` files

### Adding Images

1. Place images in `public/images/` or `public/images/posts/`
2. Reference in posts: `/images/your-image.jpg`
3. Images upload automatically when using Decap CMS

## 🚀 Deployment

### Automatic Deployment

Push to `main` branch and GitHub Actions will:

1. Install dependencies
2. Run Astro build
3. Deploy to GitHub Pages

### Manual Deployment

```bash
npm run build
# Output will be in ./dist/
```

## 📈 SEO Features

### Implemented

- ✅ Semantic HTML5
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph protocol
- ✅ Twitter Cards
- ✅ JSON-LD structured data (BlogPosting schema)
- ✅ Sitemap.xml (auto-generated)
- ✅ RSS feed at `/rss.xml`
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Alt text for images
- ✅ Fast loading (static HTML, minimal JS)
- ✅ Mobile-responsive
- ✅ Dark mode support

### Monitoring

Use these tools to monitor SEO:

- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema.org Validator](https://validator.schema.org/)

## 🛡️ Performance

- **Zero JavaScript by default**: Only UI interactions use minimal JS
- **Optimized images**: Use WebP format when possible
- **Static generation**: All pages pre-rendered at build time
- **CDN delivery**: GitHub Pages uses CDN
- **Minimal CSS**: Tailwind with PurgeCSS

## 🐛 Troubleshooting

### CMS Not Loading

1. Check browser console for errors
2. Verify Netlify Identity is enabled
3. Clear browser cache
4. Check `public/admin/config.yml` syntax

### Build Failures

1. Check GitHub Actions logs
2. Verify all posts have valid frontmatter
3. Run `npm run build` locally to test
4. Check for TypeScript errors: `npm run astro check`

### Posts Not Showing

1. Verify `draft: false` in frontmatter
2. Check date is not in the future
3. Ensure file is in `src/content/posts/`
4. Validate frontmatter against schema

## 📚 Tech Stack

| Technology                                            | Purpose                |
| ----------------------------------------------------- | ---------------------- |
| [Astro 4.x](https://astro.build)                      | Static site framework  |
| [Tailwind CSS](https://tailwindcss.com)               | Utility-first CSS      |
| [Decap CMS](https://decapcms.org)                     | Git-based headless CMS |
| [TypeScript](https://www.typescriptlang.org)          | Type safety            |
| [GitHub Pages](https://pages.github.com)              | Free hosting           |
| [GitHub Actions](https://github.com/features/actions) | CI/CD                  |

## 📖 Resources

- [Astro Documentation](https://docs.astro.build)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this repository and customize it for your own blog!

## 📧 Contact

- GitHub: [@0xmiles](https://github.com/0xmiles)
- Twitter: [@0xmiles](https://twitter.com/0xmiles)
- Blog: [https://0xmiles.github.io](https://0xmiles.github.io)

---

**Happy blogging! 🎉**
