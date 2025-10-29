import { Metadata } from "next";
import { getBlogPosts, getAllTags } from "@/lib/notion";
import { BlogCard } from "@/components/blog/BlogCard";
import { SearchBar } from "@/components/blog/SearchBar";
import { TagFilter } from "@/components/blog/TagFilter";

export const metadata: Metadata = {
  title: "블로그",
  description: "Miles의 모든 블로그 포스트를 확인해보세요.",
};

interface BlogPageProps {
  searchParams: {
    search?: string;
    tag?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [posts, tags] = await Promise.all([getBlogPosts(), getAllTags()]);

  let filteredPosts = posts;

  // 검색 필터링
  if (searchParams.search) {
    const searchQuery = searchParams.search.toLowerCase();
    filteredPosts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.description?.toLowerCase().includes(searchQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    );
  }

  // 태그 필터링
  if (searchParams.tag) {
    filteredPosts = filteredPosts.filter((post) =>
      post.tags.includes(searchParams.tag!)
    );
  }

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
          <TagFilter tags={tags} selectedTag={searchParams.tag} />
        </div>

        {/* Results Info */}
        {searchParams.search && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              "{searchParams.search}"에 대한 검색 결과: {filteredPosts.length}개
            </p>
          </div>
        )}

        {searchParams.tag && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              "{searchParams.tag}" 태그의 포스트: {filteredPosts.length}개
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
              {searchParams.search || searchParams.tag
                ? "검색 결과가 없습니다"
                : "아직 포스트가 없습니다"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchParams.search || searchParams.tag
                ? "다른 검색어나 태그를 시도해보세요."
                : "곧 흥미로운 내용으로 찾아뵙겠습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
