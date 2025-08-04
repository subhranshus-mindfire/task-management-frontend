import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/Auth';
interface ProjectCardProps {
  name: string;
  description: string;
  onAddMember?: () => void;
  onSeeMembers?: () => void;
  onDelete?: () => void;
  _id: string;
}


export default function ProjectCard({
  name,
  description,
  onAddMember,
  onDelete,
  _id,
  onSeeMembers,
}: ProjectCardProps): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isManager = user?.role === 'manager';

  return (
    <div
      className="relative rounded-lg p-5 shadow bg-white dark:bg-gray-700 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-600"
      onClick={() => navigate(`/projects/${_id}`)}
    >
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{name}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-16">{description}</p>

      {isManager && onAddMember && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddMember();
          }}
          title="Add Member"
          className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs shadow-sm hover:bg-green-200 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer hover:scale-105 font-semibold"
        >
          <i className="fas fa-user-plus"></i> Add Member
        </button>
      )}

      {isManager && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete Project"
          className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 transition cursor-pointer hover:scale-105"
        >
          <i className="fas fa-trash"></i> Delete
        </button>
      )}

      {onSeeMembers && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSeeMembers();
          }}
          title="See All Members"
          className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs shadow-sm hover:bg-purple-200 dark:hover:bg-purple-800 transition cursor-pointer hover:scale-105 font-semibold"
        >
          <i className="fas fa-users"></i> See All Members
        </button>
      )}

    </div>
  );
}
