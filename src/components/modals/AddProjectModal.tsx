import { useState, type JSX } from 'react';
import api from '../../utils/api';
import { useModal } from '../../hooks/Modal';

export default function AddProjectModal(): JSX.Element {
  const { closeModal } = useModal();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description });
      closeModal();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Create Project
      </h2>
      <form onSubmit={handleCreate} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-200 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border border-gray-200 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          cols={20}
          rows={7}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="text-gray-600 dark:text-gray-300 hover:underline  cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700  cursor-pointer"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
