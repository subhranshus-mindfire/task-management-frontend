import { useDrop } from 'react-dnd';
import type { ReactElement, ReactNode } from 'react';

interface DropZoneProps {
  status: 'complete' | 'incomplete';
  children: ReactNode;
  onDropTask: (id: string, newStatus: 'complete' | 'incomplete') => void;
}

export default function TaskDropZone({ status, children, onDropTask }: DropZoneProps): ReactElement {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string }) => onDropTask(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ref={drop}
      className={`w-full min-h-[200px] p-6 rounded-lg border transition ${
        isOver && canDrop
          ? 'bg-blue-50 border-blue-400 dark:bg-blue-950 dark:border-blue-500'
          : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
      }`}
    >
      <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        {status === 'incomplete' ? (
          <>
            <i className="fas fa-tasks" /> Incomplete Tasks
          </>
        ) : (
          <>
            <i className="fas fa-check-circle text-green-600" /> Complete Tasks
          </>
        )}
      </h2>
      {Array.isArray(children) && children.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No tasks here yet.</p>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </div>
  );
}
