import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { BlogPost } from '@/types/blog';

// 마크다운을 HTML로 변환
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  
  return result.toString();
}

// 블로그 포스트의 마크다운 콘텐츠를 HTML로 변환
export async function processBlogPostContent(post: BlogPost): Promise<string> {
  return await markdownToHtml(post.content);
}

// 마크다운에서 제목 추출
export function extractHeadings(markdown: string): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    headings.push({ level, text, id });
  }

  return headings;
}

// 마크다운에서 첫 번째 문단을 요약으로 추출
export function extractExcerpt(markdown: string, maxLength: number = 160): string {
  // 마크다운 문법 제거
  const plainText = markdown
    .replace(/#{1,6}\s+/g, '') // 제목 제거
    .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 제거
    .replace(/\*(.*?)\*/g, '$1') // 이탤릭 제거
    .replace(/`(.*?)`/g, '$1') // 인라인 코드 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 제거
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 이미지 제거
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength).trim() + '...';
}

// 마크다운에서 태그 추출
export function extractTags(markdown: string): string[] {
  const tagRegex = /#(\w+)/g;
  const tags: string[] = [];
  let match;

  while ((match = tagRegex.exec(markdown)) !== null) {
    const tag = match[1];
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }

  return tags;
}

// 마크다운에서 코드 블록 언어 추출
export function extractCodeLanguages(markdown: string): string[] {
  const codeBlockRegex = /```(\w+)/g;
  const languages: string[] = [];
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = match[1];
    if (!languages.includes(language)) {
      languages.push(language);
    }
  }

  return languages;
}
