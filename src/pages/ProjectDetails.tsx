// ProjectDetails.tsx
import React, { useEffect, useState, useRef, type JSX } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useModal } from '../hooks/Modal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableTask from '../components/tasks/DraggableTask';
import TaskDropZone from '../components/tasks/TaskDropZone';

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
    if (!taskToDelete) {return;}
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
            <TaskDropZone status="incomplete" onDropTask={handleDrop}>
              {incompleteTasks.map((task) => (
                <DraggableTask
                  key={task._id}
                  task={task}
                  onRequestDelete={requestDeleteTask}
                />
              ))}
            </TaskDropZone>
            <TaskDropZone status="complete" onDropTask={handleDrop}>
              {completeTasks.map((task) => (
                <DraggableTask
                  key={task._id}
                  task={task}
                  onRequestDelete={requestDeleteTask}
                />
              ))}
            </TaskDropZone>
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
