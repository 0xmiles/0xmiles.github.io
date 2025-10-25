# KyoongDev Blog

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

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, @tailwindcss/typography
- **CMS**: Notion API
- **Rendering**: react-notion-x
- **Deployment**: GitHub Pages

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/kyoongdev/kyoongdev.github.io.git
cd kyoongdev.github.io
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Notion Integration
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=KyoongDev Blog
NEXT_PUBLIC_SITE_DESCRIPTION=A blog powered by Notion
```

### 4. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🏗 Notion 데이터베이스 설정

블로그가 제대로 작동하려면 Notion 데이터베이스에 다음 속성들이 필요합니다:

### 필수 속성

- **Title** (제목): 텍스트
- **Slug** (슬러그): 텍스트 (URL에 사용)
- **Published** (발행): 체크박스
- **Published Date** (발행일): 날짜

### 선택적 속성

- **Description** (설명): 텍스트
- **Cover** (커버 이미지): 파일
- **Tags** (태그): 다중 선택
- **Author** (작성자): 텍스트

## 🚀 배포

### GitHub Pages 배포

1. GitHub 저장소의 Settings > Pages에서 소스를 "GitHub Actions"로 설정
2. `.github/workflows/deploy.yml` 파일이 자동으로 배포를 처리합니다
3. `main` 브랜치에 푸시하면 자동으로 배포됩니다

### 수동 배포

```bash
npm run build
npm run export
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── blog/              # 블로그 관련 페이지
│   ├── about/             # 소개 페이지
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── not-found.tsx      # 404 페이지
│   ├── robots.ts          # robots.txt
│   └── sitemap.ts         # 사이트맵
├── components/            # 재사용 가능한 컴포넌트
│   ├── blog/             # 블로그 관련 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   └── providers/        # 컨텍스트 프로바이더
├── lib/                   # 유틸리티 함수
│   └── notion.ts         # Notion API 연동
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

## 📝 라이선스

MIT License

## 🤝 기여

이슈나 풀 리퀘스트를 환영합니다!

## 📞 연락처

- GitHub: [@kyoongdev](https://github.com/kyoongdev)
- Twitter: [@kyoongdev](https://twitter.com/kyoongdev)
