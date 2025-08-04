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

  const getTaskLabel = (task: Task) => {
    if (task.status === 'complete') {return '✅ Complete';}
    const now = new Date();
    const due = new Date(task.dueDate);
    return now > due ? '🚩 Backlog' : '⏳ On Time';
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Project Tasks</h1>
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          <span className="text-lg">+</span> Add Task
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.length === 0 ? (
            <p className="text-gray-500 col-span-full">
              No tasks found for this project.
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{task.title}</h2>
                <p className="text-gray-700 mb-3">{task.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium">
                  {getTaskLabel(task)}
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                  >
                    Mark as {task.status === 'complete' ? 'Incomplete' : 'Complete'}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
