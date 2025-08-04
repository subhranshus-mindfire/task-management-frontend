import { useEffect, useState, type JSX } from 'react';
import { useAuth } from '../hooks/Auth';
import api from '../utils/api';
import LandingPage from './LandingPage';
import { Card } from '../components/Card';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'complete' | 'incomplete';
  dueDate: string;
  projectId: {
    _id: string;
    name: string;
    description?: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function Dashboard(): JSX.Element {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) { return; }

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

  const now = new Date();

  const totalTasks = tasks.length || 1; // Avoid divide by zero
  const done = tasks.filter((t) => t.status === 'complete').length;
  const incomplete = tasks.filter((t) => t.status === 'incomplete').length;
  const overdue = tasks.filter(
    (t) => t.status === 'incomplete' && new Date(t.dueDate) < now,
  ).length;

  const donePercent = ((done / totalTasks) * 100).toFixed(1);
  const incompletePercent = ((incomplete / totalTasks) * 100).toFixed(1);
  const overduePercent = ((overdue / totalTasks) * 100).toFixed(1);

  return user ? (
    <div className="p-1 lg:p-8 lg:bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          Welcome Back {user?.name || ''}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card
          title="Total Tasks"
          count={totalTasks}
          trend="Up"
          note="All assigned tasks"
        />
        <Card
          title="Incomplete"
          count={incomplete}
          trend="Up"
          percent={`${incompletePercent}%`}
          note="Pending tasks"
        />
        <Card
          title="Done"
          count={done}
          trend="Up"
          percent={`${donePercent}%`}
          note="Marked complete"
        />
        <Card
          title="Overdue"
          count={overdue}
          trend="Down"
          percent={`${overduePercent}%`}
          note="Past due date"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Project Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-xs md:text-sm">
              <tr>
                <th className="py-2 px-1 md:px-6 md:py-4">Title</th>
                <th className="py-2 px-1 md:px-6 md:py-4 hidden sm:table-cell">Description</th>
                <th className="py-2 px-1 md:px-6 md:py-4">Project</th>
                <th className="py-2 px-1 md:px-6 md:py-4 hidden sm:table-cell">Created By</th>
                <th className="py-2 px-1 md:px-6 md:py-4">Status</th>
                <th className="py-2 px-1 md:px-6 md:py-4">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="shadow text-xs md:text-sm">
                  <td className="py-2 px-1 md:px-6 md:py-4">{task.title}</td>
                  <td className="py-2 px-1 md:px-6 md:py-4 hidden sm:table-cell">
                    {task.description || 'N/A'}
                  </td>
                  <td className="py-2 px-1 md:px-6 md:py-4">{task.projectId?.name || '-'}</td>
                  <td className="py-2 px-1 md:px-6 md:py-4 hidden sm:table-cell">
                    {task.createdBy?.name || '-'}
                  </td>
                  <td className="py-2 px-1 md:px-6 md:py-4">
                    <span
                      className={`px-1 py-1 rounded-full text-xs font-semibold ${task.status === 'complete'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-2 px-1 md:px-6 md:py-4">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>
      ) : (
        <p className="p-4 text-gray-500">No tasks found.</p>
      )}
    </div>
  ) : (
    <LandingPage />
  );
}
