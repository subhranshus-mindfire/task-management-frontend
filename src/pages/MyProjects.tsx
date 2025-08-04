import { useEffect, useState, useRef, type JSX } from 'react';
import api from '../utils/api';
import ProjectCard from '../components/project/ProjectCard';
import { useAuth } from '../hooks/Auth';
import { useModal } from '../hooks/Modal';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import type { ToastVariantTypes } from '../components/ui/toast/types';
import { useToast } from '../components//ui/toast/use-toast';


interface Project {
  _id: string;
  name: string;
  description: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  userId: {
    _id: string,
    name: string
  };
}

export default function MyProjects(): JSX.Element {
  const { user, loading } = useAuth();
  const { openModal } = useModal();
  const toast = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersProjectId, setMembersProjectId] = useState<string | null>(null);

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

  const fetchMembers = async (projectId: string): Promise<void> => {
    try {
      const res = await api.get<Member[]>(`/project-members/${projectId}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const showNotification = (msg: string, type: ToastVariantTypes) => {
    toast.addToast({
      message: msg,
      variant: type,
      animation: 'slide',
      mode: 'light',
      icon: <CheckCircledIcon />,
    });
  };

  const removeMember = async (projectId: string, memberId: string): Promise<void> => {
    try {
      const res = await api.delete(`/projects/${projectId}/members/${memberId}`);
      fetchMembers(projectId);
      console.log(res);
      showNotification(res.data.message, 'success');
    } catch (err) {
      console.error('Error removing member:', err);
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

  const handleSeeMembers = async (projectId: string): Promise<void> => {
    setMembersProjectId(projectId);
    await fetchMembers(projectId);
    setShowMembersModal(true);
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
        (showDeleteModal || showMembersModal) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowDeleteModal(false);
        setShowMembersModal(false);
        setProjectToDelete(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDeleteModal, showMembersModal]);

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
            onAddMember={user.role === 'manager' ? () => handleAddMember(project._id) : undefined}
            onSeeMembers={user.role === 'manager' ? () => handleSeeMembers(project._id) : undefined}
            onDelete={user.role === 'manager' ? () => handleDeleteClick(project) : undefined}
            _id={project._id}
          />
        ))}
      </div>

      {showDeleteModal && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(0,0,0,0.3)] bg-opacity-40">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow"
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

      {showMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(0,0,0,0.3)] bg-opacity-40">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow"
          >
            <h2 className="text-lg font-bold mb-4">Project Members</h2>
            {members.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No members found.</p>
            ) : (
              <ul className="space-y-3">
                {members.map((m) => (
                  <li
                    key={m._id}
                    className="flex items-center justify-between border-b pb-2 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-semibold">{m.userId.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{m.email}</p>
                    </div>
                    <button
                      onClick={() => removeMember(membersProjectId!, m.userId._id)}
                      className="text-xs px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowMembersModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
