// src/pages/MyProjects.tsx
import { useEffect, useState, type JSX } from 'react';
import api from '../utils/api';
import ProjectCard from '../components/project/ProjectCard';
import { useAuth } from '../hooks/Auth';

interface Project {
  _id: string;
  name: string;
  description: string;
}

export default function MyProjects(): JSX.Element {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) {return;}

    api.get<Project[]>(`/projects/by-member/${user.userId}`)
      .then((res) => setProjects(res.data))
      .finally(() => setFetching(false));
  }, [user]);

  const handleAddProject = () => {
    // TODO: open Create Project modal
    console.log('Open Create Project Modal');
  };

  const handleAddMember = (projectId: string) => {
    // TODO: open Add Employee modal
    console.log(`Open Add Member Modal for project ${projectId}`);
  };

  if (loading) {return <p>Loading user...</p>;}
  if (!user) {return <p>You must be logged in to view your projects.</p>;}

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Projects</h1>
        {user.role === 'manager' && (
          <button
            onClick={handleAddProject}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
            onAddMember={
              user.role === 'manager'
                ? () => handleAddMember(project._id)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
