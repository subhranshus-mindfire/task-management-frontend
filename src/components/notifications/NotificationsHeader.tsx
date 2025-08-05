import type { JSX } from 'react';

export default function NotificationsHeader(): JSX.Element {
  return (
    <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
      <i className="fas fa-bell text-blue-600"></i> Notifications
    </h1>
  );
}
