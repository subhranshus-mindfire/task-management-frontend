import type { ReactElement } from 'react';
import type { Task } from '../../types/types';
import DashboardTaskTableRow from './DashboardTaskTableRow';

interface TaskTableProps {
  tasks: Task[];
}

export default function DashboardTaskTable({ tasks }: TaskTableProps): ReactElement {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-100 dark:bg-gray-600 text-xs md:text-sm text-gray-700 dark:text-gray-200">
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
            <DashboardTaskTableRow key={task._id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
