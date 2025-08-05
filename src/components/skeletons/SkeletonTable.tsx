import type { ReactElement } from 'react';

export default function SkeletonTable(): ReactElement {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 border-b border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" />
      ))}
    </div>
  );
}