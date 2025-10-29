# Miles Blog

Notion과 Next.js로 구축된 개인 블로그입니다.

## 🚀 기능

- **Notion 연동**: Notion 데이터베이스를 CMS로 사용
- **정적 사이트 생성**: Next.js의 정적 사이트 생성 기능 활용
- **SEO 최적화**: 메타데이터, 사이트맵, robots.txt 자동 생성
- **다크모드**: 사용자 선호도에 따른 테마 전환
- **반응형 디자인**: 모바일부터 데스크톱까지 완벽한 반응형
- **코드 하이라이팅**: Prism.js를 활용한 아름다운 코드 블록
- **검색 기능**: 제목, 설명, 태그 기반 포스트 검색
- **태그 필터링**: 카테고리별 포스트 필터링

## 🛠 기술 스택

- **Frontend**: Next.js 14.0.4, React 18, TypeScript 5
- **Styling**: Tailwind CSS 3.3, @tailwindcss/typography
- **CMS**: Notion API (@notionhq/client, notion-client)
- **Rendering**: react-notion-x 7.7.1
- **Code Highlighting**: Prism.js 1.29
- **Utilities**: date-fns, react-use
- **Package Manager**: Yarn
- **Deployment**: GitHub Pages

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/0xmiles/0xmiles.github.io.git
cd 0xmiles.github.io
```

### 2. 의존성 설치

```bash
yarn install
# 또는
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Notion Integration (필수)
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id

# Notion Client API (선택적, 페이지 콘텐츠 렌더링용)
NOTION_AUTH_TOKEN=your_notion_auth_token
NOTION_USER=your_notion_user_id

# Site Configuration (필수)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Miles Blog
NEXT_PUBLIC_SITE_DESCRIPTION=A blog powered by Notion
```

**Notion 설정 방법:**

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 새 Integration 생성
2. `NOTION_TOKEN`에 Integration Token 복사
3. Notion 데이터베이스에서 해당 Integration을 "연결"로 설정
4. 데이터베이스 URL에서 `NOTION_DATABASE_ID` 추출 (32자리 UUID)

### 4. 개발 서버 실행

```bash
yarn dev
# 또는
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🏗 Notion 데이터베이스 설정

블로그가 제대로 작동하려면 Notion 데이터베이스에 다음 속성들이 필요합니다:

### 필수 속성

- **Title** (제목): `Title` - 텍스트 타입
- **Published** (발행): `Published` - 체크박스 타입
- **Created Time** (생성 시간): 자동 생성 또는 날짜 타입

### 선택적 속성

- **Description** (설명): `Description` - 텍스트 타입
- **Slug** (슬러그): `Slug` - 텍스트 타입 (없으면 페이지 ID 사용)
- **Cover** (커버 이미지): `Cover` - 파일 타입
- **Tags** (태그): `Tags` - 다중 선택 타입
- **Author** (작성자): `Author` - 텍스트 타입

**참고**: 현재 구현에서는 포스트의 슬러그로 페이지 ID를 기본값으로 사용합니다.

## 🚀 배포

### GitHub Pages 배포 (자동)

1. GitHub 저장소의 Settings > Pages에서 소스를 "GitHub Actions"로 설정
2. `.github/workflows/deploy.yml` 파일이 자동으로 배포를 처리합니다
3. `main` 브랜치에 푸시하면 자동으로 배포됩니다
4. GitHub Secrets에 다음 환경 변수들을 설정하세요:
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_DESCRIPTION`
   - (선택) `NOTION_AUTH_TOKEN`
   - (선택) `NOTION_USER`

### 수동 배포

```bash
yarn build
yarn export
# 또는
npm run build
npm run export
```

**참고**: Next.js 14에서는 `next.config.js`에서 `output: 'export'` 설정이 되어 있어, `yarn build` 실행 시 자동으로 정적 파일이 `out` 디렉토리에 생성됩니다.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── blog/              # 블로그 관련 페이지
│   │   └── [slug]/       # 개별 포스트 페이지
│   ├── about/             # 소개 페이지
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── not-found.tsx      # 404 페이지
│   ├── robots.ts          # robots.txt (동적 생성)
│   └── sitemap.ts         # 사이트맵 (동적 생성)
├── components/            # 재사용 가능한 컴포넌트
│   ├── blog/             # 블로그 관련 컴포넌트
│   │   ├── BlogCard.tsx  # 포스트 카드
│   │   ├── Hero.tsx      # 히어로 섹션
│   │   ├── NotionRenderer.tsx  # Notion 콘텐츠 렌더러
│   │   ├── SearchBar.tsx # 검색 바
│   │   └── TagFilter.tsx # 태그 필터
│   ├── layout/           # 레이아웃 컴포넌트
│   │   ├── Header.tsx    # 헤더
│   │   └── Footer.tsx    # 푸터
│   ├── providers/        # 컨텍스트 프로바이더
│   │   └── ThemeProvider.tsx  # 다크모드 테마 프로바이더
│   └── about/            # 소개 페이지 컴포넌트
│       └── ProjectCard.tsx
├── lib/                   # 유틸리티 함수
│   └── notion.ts         # Notion API 연동 (CRUD)
└── types/                 # TypeScript 타입 정의
    └── blog.ts           # 블로그 관련 타입
```

## 🎨 커스터마이징

### 색상 테마 변경

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

### 폰트 변경

`src/app/layout.tsx`에서 폰트를 변경할 수 있습니다:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
```

코드 블록 폰트는 `tailwind.config.js`에서 변경할 수 있습니다:

```javascript
fontFamily: {
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],
}
```

## 📝 스크립트

- `yarn dev` - 개발 서버 실행 (포트 3000)
- `yarn build` - 프로덕션 빌드 생성
- `yarn start` - 프로덕션 서버 실행
- `yarn export` - 정적 사이트 생성 (`out` 디렉토리)
- `yarn lint` - ESLint 실행

## 📞 연락처

- GitHub: [@miles](https://github.com/0xmiles)
