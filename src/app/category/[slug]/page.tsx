import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories, getPostsByCategory } from '@/lib/notion';
import { BlogList } from '@/components/blog/BlogList';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getAllCategories();
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    return {
      title: '카테고리를 찾을 수 없습니다',
    };
  }

  return {
    title: `${category.name} 카테고리`,
    description: `${category.name} 카테고리의 모든 포스트를 확인해보세요.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [categories, posts] = await Promise.all([
    getAllCategories(),
    getPostsByCategory(params.slug),
  ]);

  const category = categories.find(cat => cat.slug === params.slug);

  if (!category) {
    notFound();
  }

  const featuredPost = posts.length > 0 ? posts[0] : undefined;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link href="/category">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              카테고리로 돌아가기
            </Button>
          </Link>
        </div>

        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FolderOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              {category.name}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {category.description || `${category.name} 카테고리의 모든 포스트입니다.`}
          </p>
          <div className="mt-4">
            <span className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
              {category.postCount}개의 포스트
            </span>
          </div>
        </div>

        {/* 검색 */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={`${category.name} 포스트 검색...`}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 포스트 목록 */}
        <BlogList 
          posts={posts} 
          featuredPost={featuredPost}
          showFeatured={posts.length > 3}
          title={`${category.name} 포스트`}
        />

        {/* 다른 카테고리 링크 */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            다른 카테고리 보기
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {categories
              .filter(cat => cat.slug !== params.slug)
              .slice(0, 5)
              .map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`}>
                  <Button variant="outline" size="sm">
                    {cat.name}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({cat.postCount})
                    </span>
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
