import type { ReactElement } from 'react';

interface DashboardHeaderProps {
  userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps): ReactElement {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Welcome Back {userName}
      </h1>
    </header>
  );
}