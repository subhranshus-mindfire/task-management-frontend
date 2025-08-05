import type { ReactElement } from 'react';
import type { Task } from '../../types/types';

interface TaskTableRowProps {
  task: Task;
}

export default function DashboardTaskTableRow({ task }: TaskTableRowProps):ReactElement {
  return (
    <tr className="shadow text-xs md:text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-700">
      <td className="py-2 px-1 md:px-6 md:py-4">{task.title}</td>
      <td className="py-2 px-1 md:px-6 md:py-4 hidden sm:table-cell">
        {task.description || 'N/A'}
      </td>
      <td className="py-2 px-1 md:px-6 md:py-4">
        {task.projectId?.name || '-'}
      </td>
      <td className="py-2 px-1 md:px-6 md:py-4 hidden sm:table-cell">
        {task.createdBy?.name || '-'}
      </td>
      <td className="py-2 px-1 md:px-6 md:py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            task.status === 'complete'
              ? 'bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-200 dark:text-yellow-800'
          }`}
        >
          {task.status}
        </span>
      </td>
      <td className="py-2 px-1 md:px-6 md:py-4">
        {new Date(task.dueDate).toLocaleDateString()}
      </td>
    </tr>
  );
}
