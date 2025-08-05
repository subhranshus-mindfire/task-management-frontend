import type { JSX } from 'react';

export default function SkeletonList(): JSX.Element {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      ))}
    </div>
  );
}
