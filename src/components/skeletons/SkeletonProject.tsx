import type { JSX } from 'react';

export default function SkeletonProject(): JSX.Element {
  return (
    <div className="animate-pulse rounded-lg p-5 shadow bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 h-72 relative">
      <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-12"></div>

      <div className="absolute bottom-4 left-4 h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="absolute bottom-4 right-4 h-6 w-28 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="absolute top-4 right-4 h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
  );
}
