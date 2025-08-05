import type { JSX } from 'react';
import type { Notification } from '../../types/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps): JSX.Element {
  return (
    <li
      key={notification._id}
      className="flex flex-col shadow rounded-lg p-4 transition bg-white dark:bg-gray-700 border border-b border-gray-700"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3">
          <i
            className={`fas ${
              notification.read
                ? 'fa-circle-check text-green-500'
                : 'fa-circle-exclamation text-yellow-500'
            } text-lg mt-1`}
          ></i>
          <div>
            <p
              className={`text-sm md:text-base ${
                notification.read
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-800 dark:text-gray-100'
              }`}
            >
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification._id)}
            className="ml-auto px-4 py-1.5 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Mark as Read
          </button>
        )}
      </div>
    </li>
  );
}
