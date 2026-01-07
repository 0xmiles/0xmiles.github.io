export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
  publishedTime?: Date;
  tags?: string[];
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    web: 'Web Development',
    backend: 'Backend',
    devops: 'DevOps',
    database: 'Database',
    algorithms: 'Algorithms',
    architecture: 'Architecture',
  };
  return labels[category] || category;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    web: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    backend: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    devops: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    database: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
    algorithms: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200',
    architecture: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

