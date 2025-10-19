import { FC } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    href: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/kyoongdev',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/kyoongdev',
    icon: Linkedin,
  },
  {
    name: 'Twitter',
    href: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/kyoongdev',
    icon: Twitter,
  },
  {
    name: 'Email',
    href: `mailto:${process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'kyoongdev@example.com'}`,
    icon: Mail,
  },
];

const footerLinks = [
  { name: '홈', href: '/' },
  { name: '블로그', href: '/blog' },
  { name: '카테고리', href: '/category' },
];

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 섹션 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                {process.env.NEXT_PUBLIC_SITE_NAME || 'KyoongDev'}
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              {process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '개발자 kyoongdev의 기술 블로그입니다.'}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md hover:bg-accent transition-colors"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 링크 섹션 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">사이트 맵</h3>
            <ul className="space-y-2">
              {footerLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 섹션 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">연락처</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {process.env.NEXT_PUBLIC_AUTHOR_NAME || 'kyoongdev'}
              </p>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'kyoongdev@example.com'}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'kyoongdev@example.com'}
              </a>
            </div>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {process.env.NEXT_PUBLIC_AUTHOR_NAME || 'kyoongdev'}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
              Powered by{' '}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Next.js
              </a>{' '}
              &{' '}
              <a
                href="https://notion.so"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Notion
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
