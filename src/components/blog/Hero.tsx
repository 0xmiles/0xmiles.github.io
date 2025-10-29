import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Miles
            <span className="text-primary-600 dark:text-primary-400 ml-3">
              Blog
            </span>
          </h1>
          <div className="mb-8 max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-medium">
              코드로 세상을 더 나은 곳으로 만들어가는 여정
            </p>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              기술의 동작 원리를 깊이 이해하고, 문제의 본질을 꿰뚫는 개발자가
              되기 위해 노력합니다.
              <br className="hidden md:block" />
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                {" "}
                매일 조금씩 성장
              </span>
              하는 과정을 기록합니다.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-semibold"
            >
              블로그 보기
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-lg font-semibold"
            >
              소개 보기
            </Link>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </section>
  );
};
