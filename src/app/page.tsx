import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/notion'
import { BlogCard } from '@/components/blog/BlogCard'
import { Hero } from '@/components/blog/Hero'

export const metadata: Metadata = {
  title: '홈',
  description: 'KyoongDev의 개인 블로그입니다. 개발 관련 글들을 공유합니다.',
}

export default async function HomePage() {
  const posts = await getBlogPosts()
  const featuredPosts = posts.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Posts */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              최신 포스트
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              최근에 작성한 글들을 확인해보세요
            </p>
          </div>

          {featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                아직 포스트가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                곧 흥미로운 내용으로 찾아뵙겠습니다.
              </p>
            </div>
          )}

          {posts.length > 6 && (
            <div className="text-center mt-12">
              <a
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                모든 포스트 보기
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            안녕하세요, KyoongDev입니다 👋
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            개발과 기술에 대한 이야기를 공유하는 블로그입니다. 
            프론트엔드 개발, 백엔드 개발, 그리고 다양한 기술 트렌드에 대한 
            경험과 생각을 정리해서 공유하고 있습니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
              React
            </span>
            <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
              Next.js
            </span>
            <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
              TypeScript
            </span>
            <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
              Node.js
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
