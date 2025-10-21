import { NotionAPI } from "notion-client";
import { BlogPost, BlogCategory, BlogTag } from "@/types/blog";
import { ExtendedRecordMap } from "notion-types";

// Notion API 클라이언트 초기화
const notionClient = new NotionAPI({
  authToken: process.env.NOTION_TOKEN,
});

// Notion 데이터베이스 ID (환경 변수에서 가져오기)
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// 데이터베이스 속성 확인 함수 (디버깅용)
export async function getDatabaseProperties() {
  try {
    if (!process.env.NOTION_TOKEN || !NOTION_DATABASE_ID) {
      return null;
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Database properties error:", response.status, errorData);
      return null;
    }

    const data = await response.json();
    console.log("Database properties:", Object.keys(data.properties));
    return data.properties;
  } catch (error) {
    console.error("Error fetching database properties:", error);
    return null;
  }
}

// Notion 페이지를 블로그 포스트로 변환
function transformNotionPageToBlogPost(page: any): BlogPost {
  const properties = page.properties;

  // 속성 이름을 유연하게 처리
  const title =
    properties.Title?.title?.[0]?.plain_text ||
    properties.Name?.title?.[0]?.plain_text ||
    "Untitled";

  // 다양한 속성 이름에서 slug 찾기
  const slug =
    properties.Slug?.rich_text?.[0]?.plain_text ||
    properties.URL?.rich_text?.[0]?.plain_text ||
    properties.Slug?.title?.[0]?.plain_text ||
    properties.URL?.title?.[0]?.plain_text ||
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
    content: "", // RecordMap에서 가져올 예정
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

// 모든 블로그 포스트 가져오기
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // 환경 변수가 없으면 빈 배열 반환
    if (!process.env.NOTION_TOKEN || !NOTION_DATABASE_ID) {
      console.log("Notion API 설정이 없습니다.");
      return [];
    }

    // 먼저 데이터베이스 속성을 확인
    await getDatabaseProperties();

    // Notion API를 사용하여 데이터베이스에서 페이지 가져오기
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Notion API error:", response.status, errorData);
      throw new Error(`Notion API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const posts = data.results.map((page: any) =>
      transformNotionPageToBlogPost(page)
    );

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// 특정 포스트 가져오기
export async function getPostBySlug(
  id: string
): Promise<ExtendedRecordMap | null> {
  const recordMap = await notionClient.getPage(id);
  return recordMap;
}
// Notion 페이지의 RecordMap 가져오기
export async function getNotionPageRecordMap(
  pageId: string
): Promise<ExtendedRecordMap | null> {
  try {
    if (!process.env.NOTION_TOKEN) {
      return null;
    }

    const recordMap = await notionClient.getPage(pageId);
    return recordMap;
  } catch (error) {
    console.error("Error fetching Notion page record map:", error);
    return null;
  }
}

// 특정 포스트와 RecordMap 가져오기
export async function getPostWithRecordMap(slug: string): Promise<{
  post: BlogPost | null;
  recordMap: ExtendedRecordMap | null;
}> {
  try {
    if (!process.env.NOTION_TOKEN || !NOTION_DATABASE_ID) {
      return { post: null, recordMap: null };
    }

    // 먼저 포스트 정보 가져오기
    const post = await getPostBySlug(slug);

    if (!post) {
      return { post: null, recordMap: null };
    }

    // 포스트의 실제 Notion 페이지 ID를 사용하여 RecordMap 가져오기
    const recordMap = await getNotionPageRecordMap(slug);

    return { recordMap, post: null };
  } catch (error) {
    console.error("Error fetching post with record map:", error);
    return { post: null, recordMap: null };
  }
}

// 카테고리별 포스트 가져오기
export async function getPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  try {
    if (!process.env.NOTION_TOKEN || !NOTION_DATABASE_ID) {
      return [];
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          filter: {
            property: "Category",
            select: {
              equals: category,
            },
          },
          sorts: [
            {
              property: "Created",
              direction: "descending",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Notion API error:", response.status, errorData);
      throw new Error(`Notion API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const posts = data.results.map((page: any) =>
      transformNotionPageToBlogPost(page)
    );

    return posts;
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
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
    if (!process.env.NOTION_TOKEN || !NOTION_DATABASE_ID) {
      return [];
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          filter: {
            or: [
              {
                property: "Title",
                title: {
                  contains: query,
                },
              },
              {
                property: "Excerpt",
                rich_text: {
                  contains: query,
                },
              },
            ],
          },
          sorts: [
            {
              property: "Created",
              direction: "descending",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Notion API error:", response.status, errorData);
      throw new Error(`Notion API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const posts = data.results.map((page: any) =>
      transformNotionPageToBlogPost(page)
    );

    return posts;
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}
