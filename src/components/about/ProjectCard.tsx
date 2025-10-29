"use client";

import { FC, ReactNode, useState } from "react";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  period: string;
  children: ReactNode;
}

export const ProjectCard: FC<ProjectCardProps> = ({
  title,
  subtitle,
  period,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex-1 text-left">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <span className="text-gray-600 dark:text-gray-400 text-sm mt-1 sm:mt-0 sm:ml-4">
              {period}
            </span>
          </div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {subtitle}
          </h4>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 ml-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};
