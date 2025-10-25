'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface TagFilterProps {
  tags: string[]
  selectedTag?: string
}

export const TagFilter = ({ tags, selectedTag }: TagFilterProps) => {
  const searchParams = useSearchParams()

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Link
        href="/blog"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedTag
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        전체
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTag === tag
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
