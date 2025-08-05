import type { ReactElement } from 'react';

export default function SkeletonStats():ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-300 dark:bg-gray-600 rounded-xl" />
      ))}
    </div>
  );
}