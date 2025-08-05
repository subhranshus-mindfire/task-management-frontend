// Notifications.tsx
import { useEffect, useState, Suspense, lazy, type ReactElement } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/Auth';
import type { Notification } from '../types/types';
import SkeletonList from '../components/skeletons/SkeletonList';

const NotificationsHeader = lazy(() => import('../components/notifications/NotificationsHeader'));
const NotificationItem = lazy(() => import('../components/notifications/NotificationItem'));

export default function Notifications(): ReactElement {
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchNotifications = async (): Promise<void> => {
    try {
      const res = await api.get<Notification[]>('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setFetching(false);
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  useEffect(() => {
    if (user) {fetchNotifications();}
  }, [user]);

  if (loading) {
    return <p className="p-4 text-center text-gray-700 dark:text-gray-300">Loading user...</p>;
  }

  if (!user) {
    return <p className="p-4 text-center text-gray-700 dark:text-gray-300">Please log in to view notifications.</p>;
  }

  return (
    <div className="py-6 px-6 md:px-80 mx-auto text-gray-800 dark:text-gray-100 dark:bg-gray-800 min-h-screen">
      <Suspense fallback={<SkeletonList />}>
        <NotificationsHeader />
      </Suspense>

      {fetching ? (
        <SkeletonList />
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">You have no notifications right now.</p>
      ) : (
        <ul className="space-y-4">
          <Suspense fallback={<SkeletonList />}>
            {notifications.map((n) => (
              <NotificationItem key={n._id} notification={n} onMarkAsRead={markAsRead} />
            ))}
          </Suspense>
        </ul>
      )}
    </div>
  );
}
