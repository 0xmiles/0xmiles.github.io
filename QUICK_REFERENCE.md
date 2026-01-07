# Quick Reference Guide

One-page reference for common tasks and commands.

## 🚀 Essential Commands

```bash
# Development
npm run dev              # Start dev server (localhost:4321)
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run astro check      # Check for TypeScript/content errors

# Install/Update
npm install              # Install dependencies
npm update               # Update all packages
npm audit fix            # Fix security vulnerabilities
```

## 📝 Create a New Post

### Via CMS (Easy)
1. Visit `https://yourusername.github.io/admin`
2. Click "New Post"
3. Fill in form
4. Click "Publish"

### Via File (Advanced)
```bash
# Create file
touch src/content/posts/my-new-post.md

# Add content
cat > src/content/posts/my-new-post.md << 'EOF'
---
title: "My New Post"
description: "Post description here"
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
EOF

# Commit and push
git add .
git commit -m "Add new post: My New Post"
git push
```

## 🎨 Common Customizations

### Change Site Colors
```javascript
// tailwind.config.mjs
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6',  // Change this
      },
    },
  },
},
```

### Update Site Info
```javascript
// astro.config.mjs
site: 'https://yourusername.github.io',
```

### Add Category
```typescript
// src/content/config.ts
category: z.enum(['web', 'backend', 'devops', 'database', 'algorithms', 'architecture', 'NEW']),
```

```typescript
// src/utils/seo.ts - Add to getCategoryColor()
NEW: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
```

## 📂 Important File Locations

| Task | File Path |
|------|-----------|
| Add post | `src/content/posts/*.md` |
| Edit home page | `src/pages/index.astro` |
| Edit header/nav | `src/components/Header.astro` |
| Edit footer | `src/components/Footer.astro` |
| Global styles | `src/styles/global.css` |
| Tailwind config | `tailwind.config.mjs` |
| Content schema | `src/content/config.ts` |
| CMS config | `public/admin/config.yml` |
| SEO helpers | `src/utils/seo.ts` |
| Deployment | `.github/workflows/deploy.yml` |

## 🔧 Troubleshooting

### Build Fails
```bash
# Check for errors locally
npm run build

# Check TypeScript errors
npm run astro check

# View GitHub Actions logs
# Go to: https://github.com/yourusername/yourusername.github.io/actions
```

### CMS Not Loading
1. Check Netlify Identity is enabled
2. Open browser DevTools (F12) → Console
3. Check for errors
4. Try incognito mode

### Post Not Showing
```bash
# Check frontmatter in post file
# Verify: draft: false, date is not in future

# Rebuild site
npm run build
```

### Dark Mode Not Working
```bash
# Clear browser cache
# Or: DevTools (F12) → Application → Storage → Clear site data
```

## 📊 Content Schema Reference

### Required Fields
```yaml
title: "Post Title"           # string
description: "Description"     # string
date: 2026-01-07              # date (YYYY-MM-DD)
category: backend             # enum: web|backend|devops|database|algorithms|architecture
tags: [tag1, tag2]            # array (min 1)
draft: false                  # boolean
featured: false               # boolean
author: 0xmiles               # string
```

### Optional Fields
```yaml
updated: 2026-01-08           # date
image: /images/cover.jpg      # string (URL)
imageAlt: "Alt text"          # string
canonicalUrl: https://...     # string (URL)
```

## 🌐 URLs & Routes

| Page | URL | File |
|------|-----|------|
| Home | `/` | `src/pages/index.astro` |
| All Posts | `/posts` | `src/pages/posts/index.astro` |
| Single Post | `/posts/[slug]` | `src/pages/posts/[slug].astro` |
| Category | `/category/[category]` | `src/pages/category/[category].astro` |
| RSS Feed | `/rss.xml` | `src/pages/rss.xml.ts` |
| Sitemap | `/sitemap-index.xml` | Auto-generated |
| CMS | `/admin` | `public/admin/index.html` |

## 🎨 Styling Quick Reference

### Colors
```javascript
// Tailwind utility classes
bg-blue-600          // Background color
text-gray-900        // Text color
dark:bg-gray-900     // Dark mode background
dark:text-white      // Dark mode text
```

### Layout
```javascript
container-custom     // Max-width container
card                // Card style
card-hover          // Card with hover effect
btn-primary         // Primary button
btn-secondary       // Secondary button
```

### Typography
```javascript
text-xl             // Font size
font-bold           // Font weight
leading-relaxed     // Line height
```

## 🔍 SEO Checklist

- [x] Meta title (< 60 chars)
- [x] Meta description (< 160 chars)
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Structured data (JSON-LD)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] RSS feed
- [x] Canonical URLs
- [x] Alt text on images
- [x] Mobile responsive
- [x] Fast loading (< 3s)

## 📈 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| FCP | < 1.5s | PageSpeed Insights |
| LCP | < 2.5s | PageSpeed Insights |
| CLS | < 0.1 | PageSpeed Insights |
| TTI | < 3.5s | Lighthouse |
| Performance Score | > 90 | Lighthouse |

## 🐛 Common Errors & Fixes

### "Cannot find module"
```bash
npm install
```

### "Expected date but received string"
```yaml
# Fix frontmatter date format
date: 2026-01-07  # Not: "2026-01-07" or "Jan 7, 2026"
```

### "Property 'category' must be one of..."
```yaml
# Use exact category name from schema
category: backend  # Not: "Backend" or "back-end"
```

### "Port 4321 already in use"
```bash
# Find and kill process
lsof -ti:4321 | xargs kill -9
# Or use different port
npm run dev -- --port 3000
```

## 🔑 Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push to GitHub (triggers deploy)
git push

# View commit history
git log --oneline -10

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

## 📦 Useful Scripts

### Create New Post (Bash)
```bash
#!/bin/bash
SLUG=$1
DATE=$(date +%Y-%m-%d)
cat > "src/content/posts/${SLUG}.md" << EOF
---
title: "Title Here"
description: "Description here"
date: ${DATE}
category: backend
tags: []
draft: false
featured: false
author: 0xmiles
---

# Content
EOF
echo "Created: src/content/posts/${SLUG}.md"
```

### List All Posts
```bash
ls -1 src/content/posts/
```

### Find Posts by Category
```bash
grep -l "category: backend" src/content/posts/*.md
```

### Count Posts
```bash
ls src/content/posts/*.md | wc -l
```

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| Your Site | `https://yourusername.github.io` |
| CMS Admin | `https://yourusername.github.io/admin` |
| GitHub Repo | `https://github.com/yourusername/yourusername.github.io` |
| GitHub Actions | Above URL + `/actions` |
| GitHub Pages Settings | Above URL + `/settings/pages` |
| RSS Feed | `https://yourusername.github.io/rss.xml` |

## 📚 Documentation

| Topic | Location |
|-------|----------|
| Full setup guide | `SETUP_GUIDE.md` |
| Architecture details | `ARCHITECTURE.md` |
| Project overview | `README.md` |
| This reference | `QUICK_REFERENCE.md` |

## 🆘 Need Help?

1. **Read documentation** - Check files above
2. **Search issues** - GitHub Astro issues
3. **Ask community** - [Astro Discord](https://astro.build/chat)
4. **Check logs** - GitHub Actions tab

## 💡 Pro Tips

1. **Write in drafts first** - Set `draft: true` until ready
2. **Use featured sparingly** - 2-3 featured posts max
3. **Optimize images** - Use WebP, max 1200px wide
4. **Write good descriptions** - They appear in search results
5. **Use tags consistently** - Same tag names across posts
6. **Check mobile** - Always preview on phone
7. **Monitor analytics** - See what content works
8. **Update old posts** - Keep evergreen content fresh

## 🎯 Weekly Checklist

- [ ] Write 1-2 new posts
- [ ] Review analytics
- [ ] Check for broken links
- [ ] Update featured posts rotation
- [ ] Share new content on social media
- [ ] Respond to feedback

## 📊 Monthly Tasks

- [ ] `npm update` - Update dependencies
- [ ] `npm audit` - Check security
- [ ] Review SEO performance (Search Console)
- [ ] Check site speed (PageSpeed Insights)
- [ ] Clean up unused images
- [ ] Update about/home page if needed

---

**Keep this file handy for quick lookups! 📖**

