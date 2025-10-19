import { Metadata } from 'next';
import { getAllPosts } from '@/lib/notion';
import { BlogList } from '@/components/blog/BlogList';
import { SearchBar } from '@/components/blog/SearchBar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: '홈',
  description: '개발자 kyoongdev의 기술 블로그에 오신 것을 환영합니다.',
};

export default async function HomePage() {
  const posts = await getAllPosts();
  const featuredPost = posts.length > 0 ? posts[0] : undefined;
  const recentPosts = posts.slice(0, 6);

  const features = [
    {
      icon: BookOpen,
      title: '기술 블로그',
      description: '프론트엔드, 백엔드, DevOps 등 다양한 기술 경험을 공유합니다.',
    },
    {
      icon: Code,
      title: '코드 리뷰',
      description: '실제 프로젝트에서 사용한 코드와 베스트 프랙티스를 소개합니다.',
    },
    {
      icon: Lightbulb,
      title: '개발 팁',
      description: '개발 과정에서 얻은 유용한 팁과 트러블슈팅 경험을 공유합니다.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              안녕하세요,{' '}
              <span className="text-primary">
                {process.env.NEXT_PUBLIC_AUTHOR_NAME || 'kyoongdev'}
              </span>
              입니다
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '개발자 kyoongdev의 기술 블로그입니다.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <Button size="lg" className="w-full sm:w-auto">
                  블로그 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/category">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  카테고리 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              블로그에서 다루는 내용
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              개발과 관련된 다양한 주제를 다루며, 실무 경험을 바탕으로 한 유용한 정보를 제공합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 최신 포스트 섹션 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              최신 포스트
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              최근에 작성한 포스트들을 확인해보세요.
            </p>
          </div>
          
          {recentPosts.length > 0 ? (
            <BlogList 
              posts={recentPosts} 
              featuredPost={featuredPost}
              showFeatured={true}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                아직 포스트가 없습니다.
              </p>
              <p className="text-muted-foreground">
                곧 유용한 내용으로 찾아뵙겠습니다!
              </p>
            </div>
          )}
          
          {posts.length > 6 && (
            <div className="text-center mt-12">
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  모든 포스트 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {posts.length}
              </div>
              <div className="text-muted-foreground">총 포스트</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {Array.from(new Set(posts.map(post => post.category))).length}
              </div>
              <div className="text-muted-foreground">카테고리</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {Array.from(new Set(posts.flatMap(post => post.tags))).length}
              </div>
              <div className="text-muted-foreground">태그</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
