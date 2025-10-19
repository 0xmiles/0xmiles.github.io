#!/usr/bin/env node

const { Client } = require("@notionhq/client");
const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

// 환경 변수 로드
require("dotenv").config({ path: ".env.local" });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// Notion 페이지를 마크다운으로 변환
async function convertNotionBlocksToMarkdown(blocks) {
  let markdown = "";

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        if (block.paragraph.rich_text.length > 0) {
          markdown +=
            block.paragraph.rich_text.map((text) => text.plain_text).join("") +
            "\n\n";
        } else {
          markdown += "\n";
        }
        break;

      case "heading_1":
        markdown += `# ${block.heading_1.rich_text
          .map((text) => text.plain_text)
          .join("")}\n\n`;
        break;

      case "heading_2":
        markdown += `## ${block.heading_2.rich_text
          .map((text) => text.plain_text)
          .join("")}\n\n`;
        break;

      case "heading_3":
        markdown += `### ${block.heading_3.rich_text
          .map((text) => text.plain_text)
          .join("")}\n\n`;
        break;

      case "bulleted_list_item":
        markdown += `- ${block.bulleted_list_item.rich_text
          .map((text) => text.plain_text)
          .join("")}\n`;
        break;

      case "numbered_list_item":
        markdown += `1. ${block.numbered_list_item.rich_text
          .map((text) => text.plain_text)
          .join("")}\n`;
        break;

      case "code":
        const language = block.code.language;
        const code = block.code.rich_text
          .map((text) => text.plain_text)
          .join("");
        markdown += `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
        break;

      case "quote":
        markdown += `> ${block.quote.rich_text
          .map((text) => text.plain_text)
          .join("")}\n\n`;
        break;

      case "divider":
        markdown += "---\n\n";
        break;

      case "image":
        if (block.image.type === "external") {
          markdown += `![${block.image.caption?.[0]?.plain_text || ""}](${
            block.image.external.url
          })\n\n`;
        } else if (block.image.type === "file") {
          markdown += `![${block.image.caption?.[0]?.plain_text || ""}](${
            block.image.file.url
          })\n\n`;
        }
        break;

      default:
        // 지원하지 않는 블록 타입은 무시
        break;
    }
  }

  return markdown;
}

// Notion 페이지를 블로그 포스트로 변환
function transformNotionPageToBlogPost(page) {
  const properties = page.properties;

  return {
    id: page.id,
    title: properties.Title?.title?.[0]?.plain_text || "Untitled",
    slug:
      properties.Slug?.rich_text?.[0]?.plain_text ||
      properties.Title?.title?.[0]?.plain_text
        ?.toLowerCase()
        .replace(/\s+/g, "-") ||
      "untitled",
    excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || "",
    category: properties.Category?.select?.name || "Uncategorized",
    tags: properties.Tags?.multi_select?.map((tag) => tag.name) || [],
    publishedAt: properties.Published?.date?.start || page.created_time,
    updatedAt: page.last_edited_time,
    coverImage: properties.CoverImage?.files?.[0]?.file?.url,
    author: {
      name: process.env.NEXT_PUBLIC_AUTHOR_NAME || "kyoongdev",
      email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || "",
    },
    isPublished: properties.Published?.checkbox || false,
  };
}

// 마크다운 파일 생성
async function createMarkdownFile(post, content) {
  const frontmatter = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    coverImage: post.coverImage,
    author: post.author,
    isPublished: post.isPublished,
  };

  const markdownContent = matter.stringify(content, frontmatter);

  // posts 디렉토리 생성
  await fs.mkdir(POSTS_DIR, { recursive: true });

  const filePath = path.join(POSTS_DIR, `${post.slug}.md`);
  await fs.writeFile(filePath, markdownContent, "utf8");

  return filePath;
}

// 모든 포스트 동기화
async function syncAllPosts() {
  try {
    console.log("🔄 Notion에서 포스트를 가져오는 중...");

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Published",
          direction: "descending",
        },
      ],
    });

    console.log(`📝 ${response.results.length}개의 포스트를 찾았습니다.`);

    for (const page of response.results) {
      const post = transformNotionPageToBlogPost(page);

      console.log(`📄 처리 중: ${post.title}`);

      // 페이지 내용 가져오기
      const blocks = await notion.blocks.children.list({
        block_id: page.id,
      });

      const content = await convertNotionBlocksToMarkdown(blocks.results);

      // 마크다운 파일 생성
      const filePath = await createMarkdownFile(post, content);
      console.log(`✅ 생성됨: ${filePath}`);
    }

    console.log("🎉 모든 포스트 동기화가 완료되었습니다!");
  } catch (error) {
    console.error("❌ 동기화 중 오류가 발생했습니다:", error);
    process.exit(1);
  }
}

// 특정 포스트 동기화
async function syncPostBySlug(slug) {
  try {
    console.log(`🔄 "${slug}" 포스트를 가져오는 중...`);

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });

    if (response.results.length === 0) {
      console.log(`❌ "${slug}" 포스트를 찾을 수 없습니다.`);
      return;
    }

    const page = response.results[0];
    const post = transformNotionPageToBlogPost(page);

    console.log(`📄 처리 중: ${post.title}`);

    // 페이지 내용 가져오기
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    const content = await convertNotionBlocksToMarkdown(blocks.results);

    // 마크다운 파일 생성
    const filePath = await createMarkdownFile(post, content);
    console.log(`✅ 생성됨: ${filePath}`);
  } catch (error) {
    console.error("❌ 동기화 중 오류가 발생했습니다:", error);
    process.exit(1);
  }
}

// 메인 함수
async function main() {
  const args = process.argv.slice(2);

  if (!DATABASE_ID) {
    console.error("❌ NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  if (!process.env.NOTION_API_KEY) {
    console.error("❌ NOTION_API_KEY 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  if (args.length === 0) {
    // 모든 포스트 동기화
    await syncAllPosts();
  } else if (args[0] === "--slug" && args[1]) {
    // 특정 포스트 동기화
    await syncPostBySlug(args[1]);
  } else {
    console.log("사용법:");
    console.log("  npm run notion:sync              # 모든 포스트 동기화");
    console.log("  npm run notion:sync -- --slug <slug>  # 특정 포스트 동기화");
    process.exit(1);
  }
}

main();
