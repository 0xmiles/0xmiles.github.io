import { Metadata } from 'next';
import { getAllPosts } from '@/lib/notion';
import { BlogList } from '@/components/blog/BlogList';
import { Button } from '@/components/ui/Button';
import { Filter, Grid, List } from 'lucide-react';

export const metadata: Metadata = {
  title: '블로그',
  description: '개발자 kyoongdev의 모든 블로그 포스트를 확인해보세요.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const featuredPost = posts.length > 0 ? posts[0] : undefined;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            블로그
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            개발과 관련된 다양한 주제의 포스트들을 확인해보세요.
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="포스트 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
              <div className="flex border rounded-md">
                <Button variant="ghost" size="sm" className="rounded-r-none">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-l-none">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 포스트 목록 */}
        <BlogList 
          posts={posts} 
          featuredPost={featuredPost}
          showFeatured={true}
        />
      </div>
    </div>
  );
}
