import { Metadata } from 'next';
import { getAllCategories, getAllPosts } from '@/lib/notion';
import { CategoryCard } from '@/components/blog/CategoryCard';
import { BlogList } from '@/components/blog/BlogList';
import { FolderOpen, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: '카테고리',
  description: '블로그 포스트를 카테고리별로 분류하여 확인해보세요.',
};

export default async function CategoryPage() {
  const [categories, posts] = await Promise.all([
    getAllCategories(),
    getAllPosts(),
  ]);

  const featuredPost = posts.length > 0 ? posts[0] : undefined;
  const recentPosts = posts.slice(0, 6);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            카테고리
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            관심 있는 주제별로 포스트를 분류하여 확인해보세요.
          </p>
        </div>

        {/* 카테고리 그리드 */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <FolderOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">
              모든 카테고리
            </h2>
          </div>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                아직 카테고리가 없습니다.
              </p>
            </div>
          )}
        </section>

        {/* 최신 포스트 섹션 */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">
              최신 포스트
            </h2>
          </div>
          
          {recentPosts.length > 0 ? (
            <BlogList 
              posts={recentPosts} 
              featuredPost={featuredPost}
              showFeatured={false}
            />
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                아직 포스트가 없습니다.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
