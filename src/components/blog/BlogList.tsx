import { FC } from 'react';
import { BlogPost } from '@/types/blog';
import { BlogCard } from './BlogCard';

interface BlogListProps {
  posts: BlogPost[];
  featuredPost?: BlogPost;
  title?: string;
  showFeatured?: boolean;
}

export const BlogList: FC<BlogListProps> = ({ 
  posts, 
  featuredPost, 
  title = '최신 포스트',
  showFeatured = true 
}) => {
  return (
    <div className="space-y-8">
      {title && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">
            총 {posts.length}개의 포스트가 있습니다.
          </p>
        </div>
      )}
      
      {showFeatured && featuredPost && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-6">추천 포스트</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BlogCard post={featuredPost} featured />
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(showFeatured && featuredPost ? posts.slice(3) : posts).map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            아직 포스트가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};
