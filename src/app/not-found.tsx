import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  description: '요청하신 페이지를 찾을 수 없습니다.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-muted-foreground mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
          
          <Link href="/blog">
            <Button variant="outline" size="lg" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              블로그 보기
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            문제가 지속되면{' '}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'kyoongdev@example.com'}`}
              className="text-primary hover:underline"
            >
              연락해주세요
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
