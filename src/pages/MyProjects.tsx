import { useEffect, useState, useRef, type JSX } from 'react';
import api from '../utils/api';
import ProjectCard from '../components/project/ProjectCard';
import { useAuth } from '../hooks/Auth';
import { useModal } from '../hooks/Modal';

interface Project {
  _id: string;
  name: string;
  description: string;
}

export default function MyProjects(): JSX.Element {
  const { user, loading } = useAuth();
  const { openModal } = useModal();

  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const fetchProjects = async (): Promise<void> => {
    if (!user) { return; }

    try {
      setFetching(true);
      const res = await api.get<Project[]>(`/projects/by/${user.userId}`);
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleAddProject = (): void => {
    openModal('createProject');
  };

  const handleAddMember = (projectId: string): void => {
    openModal('addMember', { projectId });
  };

  const handleDeleteClick = (project: Project): void => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!projectToDelete) { return; }

    try {
      await api.delete(`/projects/${projectToDelete._id}`);
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    } finally {
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        showDeleteModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowDeleteModal(false);
        setProjectToDelete(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDeleteModal]);

  if (loading) { return <p className="dark:text-gray-200">Loading user...</p>; }
  if (!user) { return <p className="dark:text-gray-200">You must be logged in to view your projects.</p>; }

  return (
    <div className="p-1 md:px-40 text-gray-900 dark:text-gray-100 dark:bg-gray-800 min-h-screen">
      <div className="flex items-center justify-between mb-4 text-xl lg:text-2xl pt-4">
        <h1 className="font-bold">My Projects</h1>
        {user.role === 'manager' && (
          <button
            onClick={handleAddProject}
            className="bg-blue-600 text-white p-2 text-base rounded hover:bg-blue-700"
          >
            + New Project
          </button>
        )}
      </div>

      {fetching && <p className="dark:text-gray-300">Loading projects...</p>}

      {projects.length === 0 && !fetching && (
        <p className="text-gray-600 dark:text-gray-400">No projects assigned yet.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            name={project.name}
            description={project.description}
            onAddMember={() => handleAddMember(project._id)}
            _id={project._id}
            onDelete={() => handleDeleteClick(project)}
          />
        ))}
      </div>

      {showDeleteModal && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(0,0,0,0.3)] bg-opacity-40">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow transition-colors"
          >
            <h2 className="text-lg font-bold mb-4">Delete Project</h2>
            <p className="mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{projectToDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
