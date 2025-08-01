// src/components/project/ProjectCard.tsx
import type { JSX } from 'react';

interface ProjectCardProps {
  name: string;
  description: string;
  onAddMember?: () => void; // optional click handler
}

export default function ProjectCard({ name, description, onAddMember }: ProjectCardProps): JSX.Element {
  return (
    <div className="border rounded p-4 shadow bg-white flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      {onAddMember && (
        <button
          onClick={onAddMember}
          title="Add Employee"
          className="text-blue-600 text-xl font-bold ml-4"
        >
          +
        </button>
      )}
    </div>
  );
}
