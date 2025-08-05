import { Suspense, lazy, useEffect, useState, type JSX } from 'react';
import { useAuth } from '../hooks/Auth';
import api from '../utils/api';
import LandingPage from './LandingPage';
import SkeletonStats from '../components/skeletons/SkeletonStats';
import SkeletonTable from '../components/skeletons/SkeletonTable';
import type { Task } from '../types/types';

const DashboardHeader = lazy(() => import('../components/dashboard/DashboardHeader'));
const DashboardStats = lazy(() => import('../components/dashboard/DashboardStats'));
const DashboardTaskTable = lazy(() => import('../components/dashboard/DashboardTaskTable'));

export default function Dashboard(): JSX.Element {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async (): Promise<void> => {
      if (!user) {return;}

      try {
        const res = await api.get(`/tasks/by-member/${user.userId}`);
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  if (!user) {return <LandingPage />;}

  const now = new Date();
  const total = tasks.length || 1;
  const done = tasks.filter((t) => t.status === 'complete').length;
  const incomplete = tasks.filter((t) => t.status === 'incomplete').length;
  const overdue = tasks.filter((t) => t.status === 'incomplete' && new Date(t.dueDate) < now).length;

  return (
    <div className="p-1 lg:p-8 min-h-screen bg-white dark:bg-gray-800 transition-colors">
      <Suspense fallback={<SkeletonStats />}>
        <DashboardHeader userName={user.name} />
        <DashboardStats
          total={total}
          done={done}
          incomplete={incomplete}
          overdue={overdue}
          donePercent={((done / total) * 100).toFixed(1)}
          incompletePercent={((incomplete / total) * 100).toFixed(1)}
          overduePercent={((overdue / total) * 100).toFixed(1)}
        />
      </Suspense>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Your Project Tasks
      </h2>

      {loading ? (
        <SkeletonTable />
      ) : tasks.length > 0 ? (
        <Suspense fallback={<SkeletonTable />}>
          <DashboardTaskTable tasks={tasks} />
        </Suspense>
      ) : (
        <p className="p-4 text-gray-500 dark:text-gray-400">No tasks found.</p>
      )}
    </div>
  );
}