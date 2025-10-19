# KyoongDev Blog

개발자 kyoongdev의 개인 기술 블로그입니다. React 기반으로 구축되었으며, Notion을 CMS로 사용합니다.

## 🚀 주요 기능

- **React 기반**: Next.js 14 App Router 사용
- **SEO 최적화**: 메타데이터, sitemap, 구조화된 데이터 지원
- **Notion 연동**: Notion을 CMS로 사용하여 콘텐츠 관리
- **반응형 디자인**: 모바일부터 데스크톱까지 완벽 지원
- **다크모드**: 라이트/다크 테마 지원
- **정적 사이트 생성**: GitHub Pages에 배포 가능

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── blog/           # 블로그 관련 페이지
│   ├── category/       # 카테고리 관련 페이지
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 홈페이지
│   ├── sitemap.ts      # 사이트맵 생성
│   └── robots.ts       # robots.txt 생성
├── components/         # React 컴포넌트
│   ├── blog/          # 블로그 관련 컴포넌트
│   ├── layout/        # 레이아웃 컴포넌트
│   ├── providers/     # Context Provider
│   └── ui/            # 기본 UI 컴포넌트
├── lib/               # 유틸리티 함수
├── types/             # TypeScript 타입 정의
└── styles/            # 글로벌 스타일
```

## 🛠️ 기술 스택

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **CMS**: Notion API
- **Deployment**: GitHub Pages
- **SEO**: Next.js Metadata API, React Helmet

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/kyoongdev/kyoongdev.github.io.git
cd kyoongdev.github.io
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Notion Integration
NOTION_API_KEY=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://kyoongdev.github.io
NEXT_PUBLIC_SITE_NAME=KyoongDev Blog
NEXT_PUBLIC_SITE_DESCRIPTION=개발자 kyoongdev의 기술 블로그
NEXT_PUBLIC_AUTHOR_NAME=kyoongdev
NEXT_PUBLIC_AUTHOR_EMAIL=your_email@example.com

# Social Links
NEXT_PUBLIC_GITHUB_URL=https://github.com/kyoongdev
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/kyoongdev
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/kyoongdev
```

### 4. Notion 설정

1. [Notion Developers](https://developers.notion.com/)에서 새 Integration 생성
2. Integration Token을 `NOTION_API_KEY`에 설정
3. 블로그 포스트를 저장할 데이터베이스 생성
4. 데이터베이스 ID를 `NOTION_DATABASE_ID`에 설정
5. 데이터베이스에 다음 속성 추가:
   - **Title** (제목): Title 타입
   - **Slug** (슬러그): Rich text 타입
   - **Excerpt** (요약): Rich text 타입
   - **Category** (카테고리): Select 타입
   - **Tags** (태그): Multi-select 타입
   - **Published** (발행 여부): Checkbox 타입
   - **CoverImage** (커버 이미지): Files 타입

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📝 Notion 동기화

### 모든 포스트 동기화

```bash
npm run notion:sync
```

### 특정 포스트 동기화

```bash
npm run notion:sync -- --slug your-post-slug
```

## 🚀 배포

### GitHub Pages에 배포

1. GitHub Actions 워크플로우 설정 (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
          NEXT_PUBLIC_SITE_URL: https://kyoongdev.github.io
          NEXT_PUBLIC_SITE_NAME: KyoongDev Blog
          NEXT_PUBLIC_SITE_DESCRIPTION: 개발자 kyoongdev의 기술 블로그
          NEXT_PUBLIC_AUTHOR_NAME: kyoongdev
          NEXT_PUBLIC_AUTHOR_EMAIL: your_email@example.com
          NEXT_PUBLIC_GITHUB_URL: https://github.com/kyoongdev
          NEXT_PUBLIC_LINKEDIN_URL: https://linkedin.com/in/kyoongdev
          NEXT_PUBLIC_TWITTER_URL: https://twitter.com/kyoongdev

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

2. GitHub 저장소 설정에서 Pages 소스를 "GitHub Actions"로 변경

## 🎨 커스터마이징

### 테마 변경

`tailwind.config.js`에서 색상 팔레트를 수정할 수 있습니다:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // 원하는 색상으로 변경
      }
    }
  }
}
```

### 컴포넌트 수정

`src/components/` 디렉토리에서 컴포넌트를 수정하여 디자인을 변경할 수 있습니다.

## 📚 사용법

### 새 포스트 작성

1. Notion에서 새 페이지 생성
2. 필요한 속성들 (제목, 슬러그, 카테고리 등) 입력
3. 내용 작성
4. "Published" 체크박스 활성화
5. 동기화 명령어 실행

### 카테고리 관리

Notion 데이터베이스의 "Category" 속성에서 카테고리를 관리할 수 있습니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

- **이메일**: kyoongdev@example.com
- **GitHub**: [@kyoongdev](https://github.com/kyoongdev)
- **LinkedIn**: [kyoongdev](https://www.linkedin.com/in/yongjun-park-614280262/)
