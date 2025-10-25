import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  description: '요청하신 페이지를 찾을 수 없습니다.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            또는{' '}
            <Link href="/blog" className="text-primary-600 dark:text-primary-400 hover:underline">
              블로그
            </Link>
            {' '}를 확인해보세요
          </div>
        </div>
      </div>
    </div>
  )
}
