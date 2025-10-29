"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogPostPreview } from "@/types/blog";

interface BlogListProps {
  posts: BlogPostPreview[];
  tags: string[];
}

export const BlogList = ({ posts, tags }: BlogListProps) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const selectedTag = searchParams.get("tag");

  // 필터링 로직
  const filteredPosts = useMemo(() => {
    let result = posts;

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 태그 필터링
    if (selectedTag) {
      result = result.filter((post) => post.tags.includes(selectedTag));
    }

    return result;
  }, [posts, searchQuery, selectedTag]);

  return (
    <>
      {/* Results Info */}
      {searchQuery && (
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            "{searchQuery}"에 대한 검색 결과: {filteredPosts.length}개
          </p>
        </div>
      )}

      {selectedTag && (
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            "{selectedTag}" 태그의 포스트: {filteredPosts.length}개
          </p>
        </div>
      )}

      {/* Blog Posts */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery || selectedTag
              ? "검색 결과가 없습니다"
              : "아직 포스트가 없습니다"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || selectedTag
              ? "다른 검색어나 태그를 시도해보세요."
              : "곧 흥미로운 내용으로 찾아뵙겠습니다."}
          </p>
        </div>
      )}
    </>
  );
};
