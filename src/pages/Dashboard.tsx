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
        console.log(res.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const now = new Date();

  const totalTasks = tasks.length;
  const done = tasks.filter((t) => t.status === 'complete').length;
  const incomplete = tasks.filter((t) => t.status === 'incomplete').length;
  const overdue = tasks.filter(
    (t) => t.status === 'incomplete' && new Date(t.dueDate) < now,
  ).length;

  return (
    user ? (
      <div className="p-8 bg-gray-50 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">
            Welcome Back {user?.name || ''}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card title="Total Tasks" count={totalTasks} trend="Up" percent="8.5%" note="Total tasks assigned" />
          <Card title="Incomplete" count={incomplete} trend="Up" percent="1.3%" note="Still pending" />
          <Card title="Done" count={done} trend="Down" percent="4.3%" note="Marked complete" />
          <Card title="Overdue" count={overdue} trend="Up" percent="1.8%" note="Past due date" />
        </div>

        <h2 className="text-xl font-semibold mb-4">Your Project Tasks</h2>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6">Title</th>
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6">Project</th>
                  <th className="py-3 px-6">Created By</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-t">
                    <td className="py-4 px-6">{task.title}</td>
                    <td className="py-4 px-6">{task.description}</td>
                    <td className="py-4 px-6">{task.projectId?.name}</td>
                    <td className="py-4 px-6">{task.createdBy?.name}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'complete'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">{new Date(task.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tasks.length === 0 && <p className="p-4 text-gray-500">No tasks found.</p>}
          </div>
        )}
      </div>
    ) : (
      <LandingPage />)
  );
}


