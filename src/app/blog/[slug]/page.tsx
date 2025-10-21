import { Button } from "@/components/ui/Button";
import { NotionRendererComponent } from "@/components/blog/NotionRenderer";
import { getAllPosts, getPostBySlug, getPostWithRecordMap } from "@/lib/notion";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Link from "next/link";
import { ExtendedRecordMap } from "notion-types";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<ExtendedRecordMap | null> {
  const recordMap = await getPostBySlug(params.slug);

  if (!recordMap) {
    return null;
  }

  return recordMap;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { post, recordMap } = await getPostWithRecordMap(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              블로그로 돌아가기
            </Button>
          </Link>
        </div>

        {/* 포스트 헤더 */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime}분 읽기
            </span>
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* 커버 이미지 */}
        {post.coverImage && (
          <div className="mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 포스트 내용 */}
        {recordMap ? (
          <NotionRendererComponent recordMap={recordMap} />
        ) : (
          <div className="prose prose-lg max-w-none">
            <div
              className="notion-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )}

        {/* 포스트 푸터 */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  {post.author.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {post.author.email}
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              마지막 수정: {formatDate(post.updatedAt)}
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
