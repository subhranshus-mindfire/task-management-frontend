import { useEffect, useState, type JSX } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/Auth';

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function Notifications(): JSX.Element {
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get<Notification[]>('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setFetching(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
      window.location.reload();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  if (loading) {
    return (
      <p className="p-4 text-center text-gray-700 dark:text-gray-300">
        Loading user...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="p-4 text-center text-gray-700 dark:text-gray-300">
        Please log in to view notifications.
      </p>
    );
  }

  return (
    <div className="py-6 px-80 mx-auto text-gray-800 dark:text-gray-100 dark:bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <i className="fas fa-bell text-blue-600"></i> Notifications
      </h1>

      {fetching && (
        <p className="text-gray-700 dark:text-gray-300">Loading notifications...</p>
      )}

      {!fetching && notifications.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          You have no notifications right now.
        </p>
      )}

      <ul className="space-y-4">
        {notifications.map((n) => (
          <li
            key={n._id}
            className="flex flex-col shadow rounded-lg p-4 transition bg-white dark:bg-gray-800 border border-b border-gray-700"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-3">
                <i
                  className={`fas ${n.read
                    ? 'fa-circle-check text-green-500'
                    : 'fa-circle-exclamation text-yellow-500'
                    } text-lg mt-1`}
                ></i>
                <div>
                  <p
                    className={`text-sm md:text-base ${n.read
                      ? 'text-gray-600 dark:text-gray-400'
                      : 'text-gray-800 dark:text-gray-100'
                      }`}
                  >
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="ml-auto px-4 py-1.5 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
