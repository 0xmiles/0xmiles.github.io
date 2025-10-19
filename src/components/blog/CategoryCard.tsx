import { FC } from 'react';
import Link from 'next/link';
import { BlogCategory } from '@/types/blog';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface CategoryCardProps {
  category: BlogCategory;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <CardHeader>
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-muted-foreground text-sm">
              {category.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {category.postCount}개의 포스트
            </span>
            <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
