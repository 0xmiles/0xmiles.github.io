import { Client } from "@notionhq/client";
import { BlogPost, BlogCategory, BlogTag, NotionPage } from "@/types/blog";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
console.log(process.env.NOTION_API_KEY);
console.log(process.env.NOTION_DATABASE_ID);

const DATABASE_ID = process.env.NOTION_DATABASE_ID || "";

// Notion 페이지를 블로그 포스트로 변환
function transformNotionPageToBlogPost(page: any): BlogPost {
  const properties = page.properties;

  // 속성 이름을 유연하게 처리
  const title =
    properties.Title?.title?.[0]?.plain_text ||
    properties.Name?.title?.[0]?.plain_text ||
    "Untitled";

  const slug =
    properties.Slug?.rich_text?.[0]?.plain_text ||
    properties.URL?.rich_text?.[0]?.plain_text ||
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "") ||
    "untitled";

  const excerpt =
    properties.Excerpt?.rich_text?.[0]?.plain_text ||
    properties.Summary?.rich_text?.[0]?.plain_text ||
    "";

  const category =
    properties.Category?.select?.name ||
    properties.Type?.select?.name ||
    "Uncategorized";

  const tags =
    properties.Tags?.multi_select?.map((tag: any) => tag.name) ||
    properties.Tag?.multi_select?.map((tag: any) => tag.name) ||
    [];

  const publishedAt =
    properties.Published?.date?.start ||
    properties.Created?.date?.start ||
    page.created_time;

  const coverImage =
    properties.CoverImage?.files?.[0]?.file?.url ||
    properties.Image?.files?.[0]?.file?.url;

  const isPublished =
    properties.Published?.checkbox ||
    properties.Status?.select?.name === "Published" ||
    true; // 기본적으로 모든 포스트를 발행된 것으로 처리

  return {
    id: page.id,
    title,
    slug,
    content: "", // 별도로 블록을 가져와야 함
    excerpt,
    category,
    tags,
    publishedAt,
    updatedAt: page.last_edited_time,
    coverImage,
    author: {
      name: process.env.NEXT_PUBLIC_AUTHOR_NAME || "kyoongdev",
      email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || "",
    },
    readingTime: 0, // 별도 계산 필요
    isPublished,
  };
}

// Notion 블록을 마크다운으로 변환
async function convertNotionBlocksToMarkdown(blocks: any[]): Promise<string> {
  let markdown = "";

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        if (block.paragraph.rich_text.length > 0) {
          markdown +=
            block.paragraph.rich_text
              .map((text: any) => text.plain_text)
              .join("") + "\n\n";
        } else {
          markdown += "\n";
        }
        break;

      case "heading_1":
        markdown += `# ${block.heading_1.rich_text
          .map((text: any) => text.plain_text)
          .join("")}\n\n`;
        break;

      case "heading_2":
        markdown += `## ${block.heading_2.rich_text
          .map((text: any) => text.plain_text)
          .join("")}\n\n`;
        break;

      case "heading_3":
        markdown += `### ${block.heading_3.rich_text
          .map((text: any) => text.plain_text)
          .join("")}\n\n`;
        break;

      case "bulleted_list_item":
        markdown += `- ${block.bulleted_list_item.rich_text
          .map((text: any) => text.plain_text)
          .join("")}\n`;
        break;

      case "numbered_list_item":
        markdown += `1. ${block.numbered_list_item.rich_text
          .map((text: any) => text.plain_text)
          .join("")}\n`;
        break;

      case "code":
        const language = block.code.language;
        const code = block.code.rich_text
          .map((text: any) => text.plain_text)
          .join("");
        markdown += `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
        break;

      case "quote":
        markdown += `> ${block.quote.rich_text
          .map((text: any) => text.plain_text)
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

// 더미 데이터 생성
function createDummyPosts(): BlogPost[] {
  return [
    {
      id: "dummy-1",
      title: "Next.js 14 App Router 완벽 가이드",
      slug: "nextjs-14-app-router-guide",
      content:
        "# Next.js 14 App Router\n\nNext.js 14의 새로운 App Router에 대해 알아보겠습니다.\n\n## 주요 특징\n\n- 서버 컴포넌트 지원\n- 향상된 성능\n- 더 나은 개발자 경험",
      excerpt:
        "Next.js 14의 새로운 App Router의 주요 특징과 사용법을 알아보세요.",
      category: "Frontend",
      tags: ["Next.js", "React", "JavaScript"],
      publishedAt: "2024-01-15",
      updatedAt: "2024-01-15",
      coverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
      author: {
        name: "kyoongdev",
        email: "9898junjun2@gmail.com",
      },
      readingTime: 5,
      isPublished: true,
    },
    {
      id: "dummy-2",
      title: "TypeScript로 더 안전한 코드 작성하기",
      slug: "typescript-safe-coding",
      content:
        "# TypeScript로 더 안전한 코드 작성하기\n\nTypeScript의 타입 시스템을 활용하여 더 안전하고 유지보수하기 쉬운 코드를 작성하는 방법을 알아보겠습니다.",
      excerpt:
        "TypeScript의 타입 시스템을 활용한 안전한 코딩 방법을 소개합니다.",
      category: "Programming",
      tags: ["TypeScript", "JavaScript", "Programming"],
      publishedAt: "2024-01-10",
      updatedAt: "2024-01-10",
      coverImage:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      author: {
        name: "kyoongdev",
        email: "9898junjun2@gmail.com",
      },
      readingTime: 8,
      isPublished: true,
    },
    {
      id: "dummy-3",
      title: "Tailwind CSS로 빠른 스타일링하기",
      slug: "tailwind-css-fast-styling",
      content:
        "# Tailwind CSS로 빠른 스타일링하기\n\nTailwind CSS를 사용하여 빠르고 효율적으로 스타일링하는 방법을 알아보겠습니다.",
      excerpt:
        "Tailwind CSS의 유틸리티 클래스를 활용한 빠른 스타일링 방법을 소개합니다.",
      category: "Frontend",
      tags: ["Tailwind CSS", "CSS", "Styling"],
      publishedAt: "2024-01-05",
      updatedAt: "2024-01-05",
      coverImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      author: {
        name: "kyoongdev",
        email: "9898junjun2@gmail.com",
      },
      readingTime: 6,
      isPublished: true,
    },
  ];
}

// 모든 블로그 포스트 가져오기
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // Notion API 키나 데이터베이스 ID가 없으면 더미 데이터 반환
    if (!process.env.NOTION_API_KEY || !DATABASE_ID) {
      console.log("Notion API 설정이 없어 더미 데이터를 사용합니다.");
      return createDummyPosts();
    }

    // 먼저 데이터베이스 속성을 확인
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });
    const properties = database.properties;

    // 사용 가능한 속성 이름 찾기
    const publishedProperty =
      properties.Published || properties.Status || properties.Name;
    const sortProperty = publishedProperty
      ? Object.keys(properties).find(
          (key) =>
            properties[key].type === "created_time" ||
            properties[key].type === "last_edited_time" ||
            properties[key].type === "date"
        ) || "created_time"
      : "created_time";

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      // Published 속성이 있으면 필터 적용, 없으면 모든 포스트 가져오기
      ...(publishedProperty && publishedProperty.type === "checkbox"
        ? {
            filter: {
              property: "Published",
              checkbox: {
                equals: true,
              },
            },
          }
        : {}),
      sorts: [
        {
          property: sortProperty,
          direction: "descending",
        },
      ],
    });

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        const blogPost = transformNotionPageToBlogPost(page);

        // 페이지 내용 가져오기
        const blocks = await notion.blocks.children.list({
          block_id: page.id,
        });

        blogPost.content = await convertNotionBlocksToMarkdown(blocks.results);

        // 읽기 시간 계산 (대략 200단어/분)
        const wordCount = blogPost.content.split(/\s+/).length;
        blogPost.readingTime = Math.ceil(wordCount / 200);

        return blogPost;
      })
    );

    return posts;
  } catch (error) {
    console.error("Error fetching posts from Notion:", error);
    console.log("더미 데이터를 사용합니다.");
    return createDummyPosts();
  }
}

// 특정 포스트 가져오기
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Notion API 키나 데이터베이스 ID가 없으면 더미 데이터에서 찾기
    if (!process.env.NOTION_API_KEY || !DATABASE_ID) {
      const dummyPosts = createDummyPosts();
      return dummyPosts.find((post) => post.slug === slug) || null;
    }

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
      return null;
    }

    const page = response.results[0];
    const blogPost = transformNotionPageToBlogPost(page);

    // 페이지 내용 가져오기
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    blogPost.content = await convertNotionBlocksToMarkdown(blocks.results);

    // 읽기 시간 계산
    const wordCount = blogPost.content.split(/\s+/).length;
    blogPost.readingTime = Math.ceil(wordCount / 200);

    return blogPost;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    // 에러 발생 시 더미 데이터에서 찾기
    const dummyPosts = createDummyPosts();
    return dummyPosts.find((post) => post.slug === slug) || null;
  }
}

// 카테고리별 포스트 가져오기
export async function getPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  try {
    // Notion API 키나 데이터베이스 ID가 없으면 더미 데이터에서 필터링
    if (!process.env.NOTION_API_KEY || !DATABASE_ID) {
      const dummyPosts = createDummyPosts();
      return dummyPosts.filter((post) => post.category === category);
    }

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Category",
            select: {
              equals: category,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Published",
          direction: "descending",
        },
      ],
    });

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        const blogPost = transformNotionPageToBlogPost(page);

        const blocks = await notion.blocks.children.list({
          block_id: page.id,
        });

        blogPost.content = await convertNotionBlocksToMarkdown(blocks.results);

        const wordCount = blogPost.content.split(/\s+/).length;
        blogPost.readingTime = Math.ceil(wordCount / 200);

        return blogPost;
      })
    );

    return posts;
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    // 에러 발생 시 더미 데이터에서 필터링
    const dummyPosts = createDummyPosts();
    return dummyPosts.filter((post) => post.category === category);
  }
}

// 모든 카테고리 가져오기
export async function getAllCategories(): Promise<BlogCategory[]> {
  try {
    const posts = await getAllPosts();
    const categoryMap = new Map<string, number>();

    posts.forEach((post) => {
      const count = categoryMap.get(post.category) || 0;
      categoryMap.set(post.category, count + 1);
    });

    return Array.from(categoryMap.entries()).map(([name, postCount]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      postCount,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// 모든 태그 가져오기
export async function getAllTags(): Promise<BlogTag[]> {
  try {
    const posts = await getAllPosts();
    const tagMap = new Map<string, number>();

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        const count = tagMap.get(tag) || 0;
        tagMap.set(tag, count + 1);
      });
    });

    return Array.from(tagMap.entries()).map(([name, postCount]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      postCount,
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// 검색 기능
export async function searchPosts(query: string): Promise<BlogPost[]> {
  try {
    const posts = await getAllPosts();

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}
