import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";

// Notion API 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Notion Client API (for page content)
const notionClient = process.env.NOTION_AUTH_TOKEN
  ? new NotionAPI({
      authToken: process.env.NOTION_AUTH_TOKEN,
      activeUser: process.env.NOTION_USER,
    })
  : null;
// 블로그 포스트 타입 정의
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover?: string;
  published: boolean;
  publishedAt: string;
  tags: string[];
  author: string;
  content?: ExtendedRecordMap;
}

// Notion 데이터베이스에서 블로그 포스트 목록 가져오기
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Created Time",
          direction: "descending",
        },
      ],
    });

    return response.results.map((page: any) => {
      const properties = page.properties;
      // const slug = page.url.split("/").pop();
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || "Untitled",
        slug: page.id,
        description: properties.Description?.rich_text?.[0]?.plain_text,
        cover: properties.Cover?.files?.[0]?.file?.url,
        published: properties.Published?.checkbox || false,
        publishedAt:
          properties["Created Time"]?.date?.start || page.created_time,
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        author: properties.Author?.rich_text?.[0]?.plain_text || "Miles",
      };
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// 특정 블로그 포스트 가져오기
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return null;
    }

    // notion-client를 사용하여 페이지 콘텐츠 가져오기 (가능한 경우)
    if (notionClient) {
      try {
        const recordMap = await notionClient.getPage(post.id, {});
        return {
          ...post,
          content: recordMap,
        };
      } catch (pageError: any) {
        console.error(
          "Error fetching page content with notion-client:",
          pageError.message
        );
        // fallback으로 계속 진행
      }
    }

    // 대안: @notionhq/client를 사용하여 페이지 내용 가져오기
    try {
      const response = await notion.blocks.children.list({
        block_id: post.id,
      });

      // ExtendedRecordMap 형태로 변환
      const recordMap = {
        block: {},
        collection: {},
        collectionView: {},
        collection_view: {},
        collection_query: {},
        notion_user: {},
        signed_urls: {},
        preview_images: {},
      } as unknown as ExtendedRecordMap;

      // 블록 데이터 변환
      response.results.forEach((block: any) => {
        recordMap.block[block.id] = block;
      });

      return {
        ...post,
        content: recordMap,
      };
    } catch (fallbackError) {
      console.error("Fallback method also failed:", fallbackError);
      // 에러가 발생해도 빌드를 계속 진행할 수 있도록 기본 구조 반환
      return {
        ...post,
        content: {
          block: {},
          collection: {},
          collectionView: {},
          collection_view: {},
          collection_query: {},
          notion_user: {},
          signed_urls: {},
          preview_images: {},
        } as unknown as ExtendedRecordMap,
      };
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// 태그별 블로그 포스트 가져오기
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Tags",
            multi_select: {
              contains: tag,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Created Time",
          direction: "descending",
        },
      ],
    });

    return response.results.map((page: any) => {
      const properties = page.properties;

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || "Untitled",
        slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
        description: properties.Description?.rich_text?.[0]?.plain_text,
        cover: properties.Cover?.files?.[0]?.file?.url,
        published: properties.Published?.checkbox || false,
        publishedAt:
          properties["Created Time"]?.date?.start || page.created_time,
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        author: properties.Author?.rich_text?.[0]?.plain_text || "Miles",
      };
    });
  } catch (error) {
    console.error("Error fetching blog posts by tag:", error);
    return [];
  }
}

// 모든 태그 가져오기
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getBlogPosts();
    const allTags = posts.flatMap((post) => post.tags);
    return Array.from(new Set(allTags)).sort();
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// 검색 기능
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  try {
    const posts = await getBlogPosts();
    const lowercaseQuery = query.toLowerCase();

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.description?.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error("Error searching blog posts:", error);
    return [];
  }
}
