# Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Content Creation Layer                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐              ┌──────────────────┐      │
│  │   Decap CMS     │              │   Direct Git     │      │
│  │   Web Editor    │              │   (VSCode/IDE)   │      │
│  │  (/admin UI)    │              │                  │      │
│  └────────┬────────┘              └─────────┬────────┘      │
│           │                                  │               │
│           └──────────────┬───────────────────┘               │
│                          │                                   │
│                          ▼                                   │
│              ┌────────────────────────┐                      │
│              │  GitHub Repository     │                      │
│              │  (main branch)         │                      │
│              │  - Markdown files      │                      │
│              │  - Astro components    │                      │
│              │  - Configuration       │                      │
│              └───────────┬────────────┘                      │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ Push event triggers
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Build & Deploy Layer                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           GitHub Actions Workflow                   │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  1. Checkout code                                   │    │
│  │  2. Setup Node.js 20                                │    │
│  │  3. npm ci (install dependencies)                   │    │
│  │  4. npm run build                                   │    │
│  │     ├─> Astro Build Process:                        │    │
│  │     │   ├─ Validate content (Zod schema)            │    │
│  │     │   ├─ Generate static HTML                     │    │
│  │     │   ├─ Compile TypeScript                       │    │
│  │     │   ├─ Process Tailwind CSS                     │    │
│  │     │   ├─ Optimize images                          │    │
│  │     │   ├─ Generate sitemap.xml                     │    │
│  │     │   └─ Generate RSS feed                        │    │
│  │     └─> Output: ./dist/                             │    │
│  │  5. Upload artifact                                  │    │
│  │  6. Deploy to GitHub Pages                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Deploy to CDN
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Production Environment                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            GitHub Pages (CDN)                        │   │
│  │         https://0xmiles.github.io                    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Static Files:                                       │   │
│  │  ├─ /index.html (Home)                               │   │
│  │  ├─ /posts/index.html (All Posts)                    │   │
│  │  ├─ /posts/[slug]/index.html (Individual Posts)      │   │
│  │  ├─ /category/[category]/index.html (Categories)     │   │
│  │  ├─ /admin/index.html (CMS)                          │   │
│  │  ├─ /rss.xml (RSS Feed)                              │   │
│  │  ├─ /sitemap-index.xml (Sitemap)                     │   │
│  │  ├─ /robots.txt                                      │   │
│  │  └─ /assets/* (CSS, JS, Images)                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Accessed by
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      User Layer                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────┐    ┌────────────────┐   ┌─────────────┐ │
│  │   Readers     │    │  Search Bots   │   │  RSS Readers│ │
│  │  (Browsers)   │    │ (Google, Bing) │   │             │ │
│  └───────────────┘    └────────────────┘   └─────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Content Creation Flow

```
Writer (You)
    │
    ├─ Option A: Via CMS
    │      │
    │      ├─> Visit https://0xmiles.github.io/admin
    │      ├─> Login with Netlify Identity
    │      ├─> Create/Edit post in rich editor
    │      ├─> Click "Publish"
    │      └─> CMS commits to GitHub automatically
    │
    └─ Option B: Via Git
           │
           ├─> Edit .md file in editor
           ├─> git add, commit, push
           └─> Push to GitHub
    │
    ▼
GitHub Repository Updated
    │
    ▼
GitHub Actions Triggered (webhook)
    │
    ▼
Build Process (1-2 minutes)
    │
    ▼
Deploy to GitHub Pages
    │
    ▼
Site Live! 🎉
```

### Request Flow (Reader Visits Site)

```
User requests: https://0xmiles.github.io/posts/my-post

        │
        ▼
   GitHub Pages CDN
        │
        ├─ Checks cache
        │   └─ Hit? → Return cached HTML (< 50ms)
        │
        └─ Miss? → Fetch from origin
                │
                ▼
        Return pre-rendered HTML
        (No server-side rendering needed!)
                │
                ▼
        Browser receives:
        ├─ HTML (with all content)
        ├─ CSS (Tailwind, minified)
        ├─ Minimal JS (dark mode toggle)
        └─ Images (optimized)
                │
                ▼
        Page renders instantly
        (FCP < 1s, LCP < 2s)
```

## Component Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Page Components                       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  index.astro (Home)                                      │
│       │                                                   │
│       ├─> BaseLayout                                     │
│       │       │                                           │
│       │       ├─> BaseHead (SEO)                         │
│       │       ├─> Header (Navigation)                    │
│       │       ├─> <slot> (Page content)                  │
│       │       └─> Footer                                 │
│       │                                                   │
│       └─> Components used:                               │
│               ├─> CategoryList                           │
│               └─> PostCard (multiple)                    │
│                                                           │
│  posts/[slug].astro (Individual Post)                    │
│       │                                                   │
│       ├─> PostLayout                                     │
│       │       │                                           │
│       │       ├─> BaseLayout (inherits)                  │
│       │       └─> Article content                        │
│       │                                                   │
│       └─> Renders Markdown content                       │
│                                                           │
│  category/[category].astro (Category Archive)            │
│       │                                                   │
│       ├─> BaseLayout                                     │
│       └─> PostCard (filtered by category)                │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Content Collections Architecture

```
Content Collections (Type-Safe Content)
    │
    ├─> config.ts (Schema Definition)
    │       │
    │       └─> Zod Schema:
    │           ├─ title: string (required)
    │           ├─ description: string (required)
    │           ├─ date: date (required)
    │           ├─ category: enum (required)
    │           ├─ tags: array (required)
    │           ├─ draft: boolean (default: false)
    │           ├─ featured: boolean (default: false)
    │           └─ ... more fields
    │
    └─> posts/ (Markdown Files)
            │
            ├─> welcome-to-my-blog.md
            ├─> spring-boot-kotlin-best-practices.md
            └─> database-indexing-strategies.md
            
            Each file:
            ┌─────────────────────────┐
            │ ---                     │
            │ title: "..."            │  ← Frontmatter (validated)
            │ date: 2026-01-07        │
            │ category: backend       │
            │ ---                     │
            │                         │
            │ # Content               │  ← Markdown body
            │ ...                     │
            └─────────────────────────┘

At Build Time:
    │
    ├─> getCollection('posts') reads all files
    ├─> Validates against Zod schema
    ├─> TypeScript types auto-generated
    ├─> Errors if invalid frontmatter
    └─> Returns type-safe collection
```

## SEO Architecture

```
SEO Components & Generation
    │
    ├─> Per-Page SEO (BaseHead.astro)
    │       │
    │       ├─> Basic Meta Tags
    │       │   ├─ <title>
    │       │   ├─ <meta name="description">
    │       │   └─ <meta name="keywords">
    │       │
    │       ├─> Open Graph (astro-seo)
    │       │   ├─ og:title
    │       │   ├─ og:description
    │       │   ├─ og:image
    │       │   ├─ og:url
    │       │   └─ og:type
    │       │
    │       ├─> Twitter Cards
    │       │   ├─ twitter:card
    │       │   ├─ twitter:title
    │       │   ├─ twitter:description
    │       │   └─ twitter:image
    │       │
    │       └─> Structured Data (JSON-LD)
    │           └─ BlogPosting schema
    │               ├─ headline
    │               ├─ datePublished
    │               ├─ author
    │               ├─ publisher
    │               └─ mainEntityOfPage
    │
    ├─> Site-Wide SEO
    │       │
    │       ├─> sitemap.xml (auto-generated)
    │       │   └─ Lists all pages with:
    │       │       ├─ URL
    │       │       ├─ Last modified
    │       │       └─ Change frequency
    │       │
    │       ├─> rss.xml (custom generator)
    │       │   └─ RSS 2.0 feed with:
    │       │       ├─ Post title
    │       │       ├─ Description
    │       │       ├─ Link
    │       │       ├─ PubDate
    │       │       └─ Categories/tags
    │       │
    │       └─> robots.txt
    │           ├─ Allow all bots
    │           └─ Sitemap location
    │
    └─> Canonical URLs
        └─ Every page has <link rel="canonical">
```

## Styling Architecture

```
Styling System (Utility-First)
    │
    ├─> Tailwind CSS Configuration
    │       │
    │       ├─> tailwind.config.mjs
    │       │   ├─ Custom colors (primary, secondary)
    │       │   ├─ Dark mode: 'class'
    │       │   └─ Content paths
    │       │
    │       └─> Build Process
    │           ├─ Scans all .astro files
    │           ├─ Extracts used classes
    │           └─ Generates minimal CSS
    │
    ├─> Global Styles
    │       │
    │       └─> global.css
    │           ├─ @layer base (typography)
    │           ├─ @layer components (reusable)
    │           └─ Custom utilities
    │
    └─> Component Styles
            │
            ├─> Inline Tailwind classes (preferred)
            └─> <style> tags in .astro files (scoped)
```

## Dark Mode Architecture

```
Dark Mode System
    │
    ├─> Initialization (BaseHead.astro)
    │       │
    │       └─> Inline <script> (runs before paint)
    │           ├─ Check localStorage.theme
    │           ├─ Check prefers-color-scheme
    │           └─ Apply .dark class to <html>
    │
    ├─> Toggle (Header.astro)
    │       │
    │       └─> Button with JavaScript
    │           ├─ Toggle .dark class
    │           ├─ Save to localStorage
    │           └─ Update icons
    │
    └─> Styles (Tailwind)
            │
            └─> All components use:
                ├─ Light: bg-white text-gray-900
                └─ Dark: dark:bg-gray-900 dark:text-white
```

## Deployment Pipeline

```
GitHub Actions Workflow (.github/workflows/deploy.yml)
    │
    ├─> Trigger: push to main or manual
    │
    ├─> Job: build
    │       │
    │       ├─ Step 1: Checkout code
    │       ├─ Step 2: Setup Node.js 20
    │       ├─ Step 3: npm ci (clean install)
    │       ├─ Step 4: npm run build
    │       │          │
    │       │          ├─> Astro checks TypeScript
    │       │          ├─> Validates content schema
    │       │          ├─> Generates static pages
    │       │          ├─> Optimizes assets
    │       │          └─> Outputs to ./dist/
    │       │
    │       └─ Step 5: Upload artifact
    │
    └─> Job: deploy (needs: build)
            │
            ├─ Step 1: Download artifact
            └─ Step 2: Deploy to GitHub Pages
                      │
                      └─> Publishes to:
                          https://0xmiles.github.io
```

## Performance Architecture

```
Performance Optimizations
    │
    ├─> Build-Time Optimizations
    │       │
    │       ├─> Static Site Generation (SSG)
    │       │   └─ All pages pre-rendered (no runtime cost)
    │       │
    │       ├─> Code Splitting
    │       │   └─ Minimal JS per page
    │       │
    │       ├─> CSS Purging
    │       │   └─ Unused Tailwind classes removed
    │       │
    │       └─> Asset Optimization
    │           ├─ Images compressed
    │           └─ Fonts optimized
    │
    ├─> Runtime Optimizations
    │       │
    │       ├─> Zero Hydration
    │       │   └─ No React/Vue runtime needed
    │       │
    │       ├─> Lazy Loading
    │       │   └─ Images load on scroll
    │       │
    │       └─> CDN Caching
    │           └─ GitHub Pages CDN
    │
    └─> Measurement
            │
            └─> Core Web Vitals
                ├─ FCP: < 1s (First Contentful Paint)
                ├─ LCP: < 2s (Largest Contentful Paint)
                ├─ CLS: < 0.1 (Cumulative Layout Shift)
                └─ TTI: < 3s (Time to Interactive)
```

## Security Architecture

```
Security Layers
    │
    ├─> Content Security
    │       │
    │       ├─> Git-Based Content
    │       │   └─ Full version control & audit trail
    │       │
    │       └─> CMS Access Control
    │           ├─ Netlify Identity authentication
    │           ├─ Invite-only registration
    │           └─ GitHub OAuth integration
    │
    ├─> Transport Security
    │       │
    │       └─> HTTPS (GitHub Pages)
    │           ├─ Automatic SSL certificate
    │           └─ HSTS headers
    │
    ├─> Build Security
    │       │
    │       ├─> Dependency Scanning
    │       │   └─ npm audit in CI/CD
    │       │
    │       └─> No Server-Side Code
    │           └─ Static files only (no injection vectors)
    │
    └─> Client Security
            │
            ├─> No Secrets in Frontend
            ├─> Minimal JavaScript Attack Surface
            └─> CSP-Friendly Code
```

## Scalability Considerations

```
Scalability Aspects
    │
    ├─> Content Growth
    │       │
    │       ├─> 1-1000 posts: No issues
    │       ├─> 1000-10000 posts: Build time increases
    │       │                      (Add pagination)
    │       └─> 10000+ posts: Consider partial rebuilds
    │                         (On-demand ISR with Vercel/Netlify)
    │
    ├─> Traffic Growth
    │       │
    │       └─> GitHub Pages CDN handles:
    │           ├─ 100GB bandwidth/month (soft limit)
    │           ├─ High concurrent users (CDN scales)
    │           └─ If exceeded: Move to Vercel/Netlify
    │
    └─> Feature Growth
            │
            ├─> Add search: Pagefind or Algolia
            ├─> Add comments: Giscus integration
            ├─> Add analytics: Plausible/Umami script
            └─> Add newsletter: Buttondown/ConvertKit
```

## Key Architectural Decisions

### ✅ Why Astro?

| Decision | Reasoning |
|----------|-----------|
| Static generation | Best performance, SEO, no server needed |
| Zero JS default | Fast load times, low bandwidth |
| Content Collections | Type-safe content, build-time validation |
| Island Architecture | Add interactivity only where needed |

### ✅ Why Decap CMS?

| Decision | Reasoning |
|----------|-----------|
| Git-based | Content in repo, not external database |
| No backend needed | Serverless, free, simple |
| Open source | No vendor lock-in |
| Markdown editing | Clean content format |

### ✅ Why GitHub Pages?

| Decision | Reasoning |
|----------|-----------|
| Free hosting | $0/month for unlimited static sites |
| Built-in CI/CD | GitHub Actions integration |
| Reliable CDN | Global edge network |
| Simple setup | No server configuration |

### ✅ Why Tailwind CSS?

| Decision | Reasoning |
|----------|-----------|
| Utility-first | Fast development, consistent design |
| Purge unused | Small production CSS (~10KB) |
| Dark mode | Built-in class-based dark mode |
| Customizable | Easy to theme and extend |

## Monitoring & Observability

```
Observability Stack (Optional Add-ons)
    │
    ├─> Analytics
    │       ├─ Plausible (privacy-friendly)
    │       ├─ Umami (self-hosted)
    │       └─ Google Analytics (comprehensive)
    │
    ├─> Search Console
    │       ├─ Google Search Console
    │       └─ Bing Webmaster Tools
    │
    ├─> Performance Monitoring
    │       ├─ PageSpeed Insights
    │       ├─ Lighthouse CI
    │       └─ WebPageTest
    │
    └─> Error Tracking
            └─ Since it's static, minimal runtime errors
```

---

## Summary

This architecture provides:

1. **🚀 Performance**: Sub-second page loads via static generation
2. **🔒 Security**: No server, no database, minimal attack surface
3. **💰 Cost**: $0 hosting, no API costs
4. **📈 Scalability**: CDN handles traffic spikes
5. **🛠 Maintainability**: Simple stack, clear separation of concerns
6. **✨ DX**: Type-safe, hot reload, modern tooling
7. **📊 SEO**: All best practices built-in

Built for **long-term sustainability** with **minimal maintenance overhead**.

