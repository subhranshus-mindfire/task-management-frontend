import { useEffect, useState, type JSX } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useModal } from '../hooks/Modal';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'complete' | 'incomplete';
  dueDate: string;
}

export default function ProjectDetails(): JSX.Element {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModal();

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/project/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleAddTask = () => {
    openModal('addTask', {
      projectId: projectId!,
      onTaskCreated: fetchTasks,
    });
  };

  const getTaskStatus = (task: Task) => {
    const now = new Date();
    const due = new Date(task.dueDate);
    if (task.status === 'complete') {
      return { label: 'Complete', icon: 'fas fa-check-circle', color: 'green' };
    }
    if (now > due) {
      return { label: 'Backlog', icon: 'fas fa-flag', color: 'red' };
    }
    return { label: 'On Time', icon: 'fas fa-clock', color: 'yellow' };
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'complete' ? 'incomplete' : 'complete';
    await api.patch(`/tasks/${task._id}/status`, { status: newStatus });
    fetchTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Project Tasks</h1>
        <button
          onClick={handleAddTask}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          <i className="fas fa-plus"></i> Add Task
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="p-6 text-center text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
          No tasks found for this project. Click{' '}
          <span className="font-semibold text-gray-700">Add Task</span> to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => {
            const status = getTaskStatus(task);
            const statusColors: Record<string, string> = {
              green: 'bg-green-100 text-green-700',
              red: 'bg-red-100 text-red-700',
              yellow: 'bg-yellow-100 text-yellow-700',
            };

            return (
              <div
                key={task._id}
                className="relative border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <div
                  className={`absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status.color]}`}
                >
                  <i className={`${status.icon} text-sm`}></i> {status.label}
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h2>
                <p className="text-gray-600 mb-3">
                  {task.description || 'No description provided.'}
                </p>

                <p className="text-xs text-gray-500 mb-1">
                  Due:{' '}
                  <span className="font-medium text-gray-700">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition"
                  >
                    <i className="fas fa-sync"></i>
                    Mark {task.status === 'complete' ? 'Incomplete' : 'Complete'}
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    <i className="fas fa-trash-alt"></i>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
