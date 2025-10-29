import { Metadata } from "next";
import { Suspense } from "react";
import { getBlogPosts, getAllTags } from "@/lib/notion";
import { SearchBar } from "@/components/blog/SearchBar";
import { TagFilter } from "@/components/blog/TagFilter";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "블로그",
  description: "Miles의 모든 블로그 포스트를 확인해보세요.",
};

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getBlogPosts(), getAllTags()]);

  // BlogPostPreview 타입으로 변환
  const blogPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    cover: post.cover,
    publishedAt: post.publishedAt,
    tags: post.tags,
    author: post.author,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            블로그
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            개발과 기술에 대한 이야기를 공유합니다
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <SearchBar />
          <TagFilter tags={tags} />
        </div>

        {/* Blog List with Client-side Filtering */}
        <Suspense
          fallback={<div className="text-center py-12">로딩 중...</div>}
        >
          <BlogList posts={blogPosts} tags={tags} />
        </Suspense>
      </div>
    </div>
  );
}
