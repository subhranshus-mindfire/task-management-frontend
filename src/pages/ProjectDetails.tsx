import React, { useEffect, useState, useRef, type JSX } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useModal } from '../hooks/Modal';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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

const DraggableTask = ({ task, onRequestDelete }: DraggableTaskProps) => {
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
      //@ts-expect-error
      ref={drag}
      className={`relative border border-gray-300 dark:border-gray-600 shadow-lg rounded-xl p-5 bg-white dark:bg-gray-800 hover:shadow-2xl transition cursor-grab ${isDragging ? 'opacity-50' : ''
        }`}
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
};

export default function ProjectDetails(): JSX.Element {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModal();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleDrop = async (id: string, newStatus: 'complete' | 'incomplete') => {
    await api.patch(`/tasks/${id}/status`, { status: newStatus });
    fetchTasks();
  };

  const requestDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) { return; }
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDeleteModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowDeleteModal(false);
        setTaskToDelete(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDeleteModal]);

  const incompleteTasks = tasks.filter((t) => t.status === 'incomplete');
  const completeTasks = tasks.filter((t) => t.status === 'complete');

  const DropZone = ({
    status,
    children,
  }: {
    status: 'complete' | 'incomplete';
    children: React.ReactNode;
  }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: 'TASK',
      drop: (item: { id: string }) => handleDrop(item.id, status),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });

    return (
      <div
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        ref={drop}
        className={`w-full min-h-[200px] p-6 rounded-lg border transition ${isOver && canDrop
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
        {React.Children.count(children) === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No tasks here yet.</p>
        ) : (
          <div className="space-y-4">{children}</div>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Tasks</h1>
          <button
            onClick={handleAddTask}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            <i className="fas fa-plus" /> Add Task
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <DropZone status="incomplete">
              {incompleteTasks.map((task) => (
                <DraggableTask
                  key={task._id}
                  task={task}
                  onRequestDelete={requestDeleteTask}
                />
              ))}
            </DropZone>
            <DropZone status="complete">
              {completeTasks.map((task) => (
                <DraggableTask
                  key={task._id}
                  task={task}
                  onRequestDelete={requestDeleteTask}
                />
              ))}
            </DropZone>
          </div>
        )}

        {showDeleteModal && taskToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(0,0,0,0.4)] bg-opacity-40">
            <div
              ref={modalRef}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow"
            >
              <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
                Delete Task
              </h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{taskToDelete.title}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTask}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
