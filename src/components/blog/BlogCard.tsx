import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { BlogPostPreview } from "@/types/blog";

interface BlogCardProps {
  post: BlogPostPreview;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {post.cover && (
        <div className="relative h-48 w-full">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        {post.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {post.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{post.author}</span>
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), "yyyy년 M월 d일", {
              locale: ko,
            })}
          </time>
        </div>
      </div>
    </article>
  );
};
