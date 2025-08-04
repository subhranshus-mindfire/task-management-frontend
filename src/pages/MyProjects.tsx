import { useEffect, useState, useRef, type JSX } from 'react'; // ✅ add useRef
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

  const modalRef = useRef<HTMLDivElement>(null); // ✅ modal content ref

  const fetchProjects = async () => {
    if (!user) {return;}

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

  const handleAddProject = () => {
    openModal('createProject');
  };

  const handleAddMember = (projectId: string) => {
    openModal('addMember', { projectId });
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!projectToDelete) {return;}

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
    const handleClickOutside = (event: MouseEvent) => {
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDeleteModal]);

  if (loading) {return <p>Loading user...</p>;}
  if (!user) {return <p>You must be logged in to view your projects.</p>;}

  return (
    <div className="p-1 md:px-40">
      <div className="flex items-center justify-between mb-4 text-xl lg:text-2xl">
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

      {fetching && <p>Loading projects...</p>}

      {projects.length === 0 && !fetching && (
        <p className="text-gray-600">No projects assigned yet.</p>
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
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow"
          >
            <h2 className="text-lg font-bold mb-4">Delete Project</h2>
            <p className="mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{projectToDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
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
