# Complete Setup Guide

This guide will walk you through setting up your 0xmiles blog from scratch.

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Text editor (VS Code recommended)

## Step 1: Initial Setup (5 minutes)

### 1.1 Clone and Install

```bash
# Navigate to your projects directory
cd ~/Documents/dev

# Install dependencies
cd 0xmiles.github.io
npm install
```

### 1.2 Test Locally

```bash
npm run dev
```

Visit `http://localhost:4321` - you should see your blog!

## Step 2: Customize Your Blog (10 minutes)

### 2.1 Update Site Configuration

Edit `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',  // Change this
  // ... rest of config
});
```

### 2.2 Update Personal Information

**In `src/components/BaseHead.astro`:**
- Line 21: Update site name
- Line 38: Update Twitter handle

**In `src/components/Header.astro`:**
- Line 9-10: Update logo/brand

**In `src/components/Footer.astro`:**
- Update GitHub and Twitter links (bottom of file)

**In `src/pages/index.astro`:**
- Update hero section text
- Update about section

### 2.3 Update Metadata

**In `public/robots.txt`:**
```
Sitemap: https://yourusername.github.io/sitemap-index.xml
```

**In `public/admin/config.yml`:**
- Update author default if not using "0xmiles"

## Step 3: GitHub Setup (5 minutes)

### 3.1 Create Repository

1. Go to GitHub and create a new repository
2. Name it: `yourusername.github.io` (must be this exact format)
3. Make it public
4. Don't initialize with README (we already have files)

### 3.2 Push Your Code

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: 0xmiles blog setup"

# Add remote and push
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git branch -M main
git push -u origin main
```

### 3.3 Enable GitHub Pages

1. Go to repository **Settings**
2. Navigate to **Pages** (left sidebar)
3. Under **Source**, select **GitHub Actions**
4. Wait ~2 minutes for deployment

Visit `https://yourusername.github.io` - your blog is live! 🎉

## Step 4: Set Up Decap CMS (15 minutes)

This allows you to edit posts at `https://yourusername.github.io/admin` without git commands.

### Option A: Using Netlify Identity (Easiest)

#### 4.1 Create Netlify Account

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Skip the "Import project" step - we only need authentication

#### 4.2 Create a New Site

1. Click "Add new site" → "Import an existing project"
2. Choose GitHub
3. Select your `yourusername.github.io` repository
4. **Important**: In "Build settings", click "Deploy site" (we won't actually use Netlify hosting)

#### 4.3 Enable Identity

1. Go to site dashboard → **Identity** tab
2. Click "Enable Identity"
3. Under **Settings and usage**:
   - Click "Edit settings"
   - Registration: Change to "Invite only"
   - External providers: Optionally enable GitHub login
   - Save

#### 4.4 Enable Git Gateway

1. In Identity settings, scroll to **Services**
2. Click "Enable Git Gateway"
3. This allows CMS to commit to your GitHub repo

#### 4.5 Invite Yourself

1. Go to Identity tab
2. Click "Invite users"
3. Enter your email
4. Check your email for invitation
5. Click link and set password

#### 4.6 Add Netlify Identity Widget to Your Site

The widget is already included in `public/admin/index.html`. Just verify the script tag is present:

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

#### 4.7 Test the CMS

1. Visit `https://yourusername.github.io/admin`
2. Click "Login with Netlify Identity"
3. Enter your credentials
4. You should see the CMS dashboard!

### Option B: GitHub OAuth (Advanced)

If you prefer direct GitHub authentication:

#### 4.1 Create OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "My Blog CMS"
   - Homepage URL: `https://yourusername.github.io`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
4. Click "Register application"
5. Note your Client ID

#### 4.2 Update CMS Config

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: yourusername/yourusername.github.io
  branch: main
```

#### 4.3 Set Up Netlify for OAuth

Even with GitHub OAuth, you need Netlify as OAuth provider:

1. Follow steps 4.1-4.2 from Option A
2. Go to Site settings → Access control → OAuth
3. Click "Install provider"
4. Choose GitHub
5. Enter your Client ID and Client Secret
6. Save

## Step 5: Write Your First Post (5 minutes)

### Via CMS (Recommended)

1. Go to `https://yourusername.github.io/admin`
2. Click "New Post"
3. Fill in:
   - Title: "My First Post"
   - Description: "This is my first blog post!"
   - Date: Today
   - Category: "web"
   - Tags: "introduction", "blogging"
   - Draft: false
   - Featured: true
4. Write content in the body
5. Click "Publish"
6. Wait ~2 minutes for GitHub Actions to deploy

### Via Git (Alternative)

Create `src/content/posts/my-first-post.md`:

```markdown
---
title: "My First Post"
description: "This is my first blog post!"
date: 2026-01-07
category: web
tags:
  - introduction
  - blogging
draft: false
featured: true
author: yourusername
---

# Hello World!

This is my first post on my new blog.

## What I'll Write About

- Technology
- Software Engineering
- Cool projects

Stay tuned!
```

Commit and push:

```bash
git add .
git commit -m "Add first blog post"
git push
```

## Step 6: Add Custom Images (5 minutes)

### 6.1 Logo and Favicon

Replace `public/favicon.svg` with your own favicon.

For the logo, replace placeholder in `public/images/logo.png`.

### 6.2 Open Graph Default Image

Create a 1200×630px image and save as `public/images/og-default.jpg`.

This appears when sharing your site on social media.

### 6.3 Post Images

When using the CMS:
- Click "Choose an image" in the Cover Image field
- Upload or select from media library
- CMS automatically saves to `public/images/posts/`

When using Git:
- Place images in `public/images/posts/`
- Reference in frontmatter: `image: /images/posts/my-image.jpg`

## Step 7: Verify SEO Setup (5 minutes)

### 7.1 Test Core Web Vitals

1. Go to [PageSpeed Insights](https://pagespeed.web.dev/)
2. Enter your site URL
3. Check scores (aim for 90+ on all metrics)

### 7.2 Validate Structured Data

1. Go to [Schema Markup Validator](https://validator.schema.org/)
2. Enter a blog post URL
3. Verify BlogPosting schema is detected

### 7.3 Check Sitemap

Visit `https://yourusername.github.io/sitemap-index.xml`

Should show all your pages.

### 7.4 Test RSS Feed

Visit `https://yourusername.github.io/rss.xml`

Should show your posts in RSS format.

### 7.5 Submit to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: `https://yourusername.github.io`
3. Verify ownership (use HTML tag method)
4. Submit sitemap: `https://yourusername.github.io/sitemap-index.xml`

## Step 8: Optional Enhancements

### 8.1 Add Analytics

Add Plausible or Umami analytics (privacy-friendly):

In `src/layouts/BaseLayout.astro`, before `</head>`:

```html
<!-- Plausible Analytics -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### 8.2 Add Comments

Consider adding Giscus (GitHub Discussions-based comments):

Create `src/components/Comments.astro`:

```astro
<script src="https://giscus.app/client.js"
        data-repo="yourusername/yourusername.github.io"
        data-repo-id="YOUR_REPO_ID"
        data-category="Comments"
        data-category-id="YOUR_CATEGORY_ID"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
```

Add to `src/layouts/PostLayout.astro` after article content.

### 8.3 Add Newsletter Signup

Use Buttondown, Substack, or Mailchimp embed codes.

### 8.4 Custom Domain

1. Buy a domain (e.g., from Namecheap, Cloudflare)
2. Add `CNAME` file to `public/` with your domain
3. In domain DNS settings, add:
   - CNAME record: `www` → `yourusername.github.io`
   - A records for apex domain (see GitHub Pages docs)
4. Update `astro.config.mjs` site URL

## Troubleshooting

### Build Fails

**Check GitHub Actions logs:**
1. Go to repository → Actions tab
2. Click latest workflow run
3. Check error messages

**Common issues:**
- Invalid frontmatter syntax
- Missing required fields in posts
- TypeScript errors

**Fix:**
```bash
npm run build  # Test locally
npm run astro check  # Check for TypeScript errors
```

### CMS Not Loading

1. Open browser console (F12)
2. Check for errors
3. Verify Netlify Identity is enabled
4. Try incognito mode (clear cache)

### Posts Not Appearing

1. Check `draft: false` in frontmatter
2. Verify date is not in future
3. Ensure file is in `src/content/posts/`
4. Check schema validation errors

### Dark Mode Not Working

1. Clear browser cache
2. Check localStorage for `theme` key
3. Verify script in `src/components/BaseHead.astro` runs

## Maintenance Tips

### Regular Tasks

**Weekly:**
- Check for unused indexes using analytics
- Review popular posts
- Plan new content

**Monthly:**
- Update dependencies: `npm update`
- Check for security issues: `npm audit`
- Review and remove unused images

**Quarterly:**
- Audit SEO performance in Search Console
- Update outdated posts
- Check for broken links

### Performance Monitoring

Use these tools:
- Lighthouse (Chrome DevTools)
- WebPageTest
- GTmetrix

Aim for:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5s

## Next Steps

1. ✅ Write consistently (aim for 1-2 posts per week)
2. ✅ Share posts on social media
3. ✅ Engage with readers
4. ✅ Monitor analytics and iterate
5. ✅ Build an email list
6. ✅ Guest post on other blogs
7. ✅ Create evergreen content
8. ✅ Optimize for search intent

## Getting Help

If you encounter issues:

1. Check [Astro Discord](https://astro.build/chat)
2. Review [Decap CMS Docs](https://decapcms.org/docs/)
3. Search [GitHub Issues](https://github.com/withastro/astro/issues)
4. Ask on [Stack Overflow](https://stackoverflow.com/questions/tagged/astro)

---

**Congratulations! Your blog is now live and ready for the world! 🎉**

Happy writing! ✍️

