import { useEffect, useState, type JSX } from 'react';
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

  const fetchProjects = async () => {
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

  const handleAddProject = () => {
    openModal('createProject');
  };

  const handleAddMember = (projectId: string) => {
    openModal('addMember', { projectId });
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {return;}

    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };


  if (loading) { return <p>Loading user...</p>; }
  if (!user) { return <p>You must be logged in to view your projects.</p>; }

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
            onDelete={() => handleDeleteProject(project._id)}
          />
        ))}
      </div>
    </div>
  );
}
