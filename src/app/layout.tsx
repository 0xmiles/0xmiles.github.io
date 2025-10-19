import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'KyoongDev Blog',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'KyoongDev Blog'}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '개발자 kyoongdev의 기술 블로그',
  keywords: ['개발', '프로그래밍', '기술', '블로그', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'kyoongdev' }],
  creator: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'kyoongdev',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kyoongdev.github.io',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'KyoongDev Blog',
    title: process.env.NEXT_PUBLIC_SITE_NAME || 'KyoongDev Blog',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '개발자 kyoongdev의 기술 블로그',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: process.env.NEXT_PUBLIC_SITE_NAME || 'KyoongDev Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_SITE_NAME || 'KyoongDev Blog',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '개발자 kyoongdev의 기술 블로그',
    images: ['/og-image.png'],
    creator: process.env.NEXT_PUBLIC_TWITTER_URL?.replace('https://twitter.com/', '@') || '@kyoongdev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
