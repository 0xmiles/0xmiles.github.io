#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    await fs.access(envPath);
    console.log('✅ .env.local 파일이 이미 존재합니다.');
  } catch {
    const envContent = `# Notion Integration
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
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/kyoongdev`;

    await fs.writeFile(envPath, envContent, 'utf8');
    console.log('✅ .env.local 파일을 생성했습니다.');
  }
}

async function createContentDirectory() {
  const contentDir = path.join(process.cwd(), 'content', 'posts');
  
  try {
    await fs.mkdir(contentDir, { recursive: true });
    console.log('✅ content/posts 디렉토리를 생성했습니다.');
  } catch (error) {
    console.log('⚠️  content/posts 디렉토리 생성 중 오류:', error.message);
  }
}

async function main() {
  console.log('🚀 KyoongDev Blog 설정을 시작합니다...\n');
  
  await createEnvFile();
  await createContentDirectory();
  
  console.log('\n📝 다음 단계를 따라주세요:');
  console.log('1. .env.local 파일에서 환경 변수를 설정하세요');
  console.log('2. Notion에서 Integration을 생성하고 데이터베이스를 설정하세요');
  console.log('3. npm run dev로 개발 서버를 시작하세요');
  console.log('4. npm run notion:sync로 Notion 포스트를 동기화하세요');
  
  console.log('\n🎉 설정이 완료되었습니다!');
}

main().catch(console.error);
