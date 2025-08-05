import type { ReactElement } from 'react';
import { useDrag } from 'react-dnd';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'complete' | 'incomplete';
  dueDate: string;
}

interface DraggableTaskProps {
  task: Task;
  onRequestDelete: (task: Task) => void;
}

export default function DraggableTask({ task, onRequestDelete }: DraggableTaskProps): ReactElement {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getTaskStatus = () => {
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

  const status = getTaskStatus();
  const statusColors: Record<string, string> = {
    green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  };

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ref={drag}
      className={`relative border border-gray-300 dark:border-gray-600 shadow-lg rounded-xl p-5 bg-white dark:bg-gray-800 hover:shadow-2xl transition cursor-grab ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        className={`absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status.color]}`}
      >
        <i className={`${status.icon} text-sm`} /> {status.label}
      </div>
      <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
        {task.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        {task.description || 'No description'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>
      <button
        onClick={() => onRequestDelete(task)}
        className="inline-flex items-center gap-1 mt-3 text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition"
      >
        <i className="fas fa-trash" /> Delete
      </button>
    </div>
  );
}
