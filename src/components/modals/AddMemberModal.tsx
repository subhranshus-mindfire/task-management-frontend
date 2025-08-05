import { useState, useEffect, type JSX, type ChangeEvent } from 'react';
import api from '../../utils/api';
import { useToast } from '../ui/toast/use-toast';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import type { ToastVariantTypes } from '../ui/toast/types';
import type { AxiosError } from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AddMemberModalProps {
  onClose: () => void;
  projectId: string;
  theme?: 'light' | 'dark';
}

export default function AddMemberModal({
  onClose,
  projectId,
  theme,
}: AddMemberModalProps): JSX.Element {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const showNotification = (msg: string, type: ToastVariantTypes): void => {
    toast.addToast({
      message: msg,
      variant: type,
      animation: 'slide',
      mode: 'dark',
      icon: <CheckCircledIcon />,
      appearance: theme === 'dark' ? 'gradient' : 'premium',
    });
  };

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get<User[]>(`/users/search?query=${search}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return (): void => clearTimeout(delayDebounce);
  }, [search]);

  const handleAddMember = async (userId: string): Promise<void> => {
    try {
      const res = await api.post('/projects/add-member', {
        projectId,
        userId,
      });
      onClose();
      showNotification(res.data.message, 'success');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error.response?.data?.message || 'Failed to add member.';
      console.error(error);
      onClose();
      showNotification(errorMsg, 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Add Member</h2>

      <input
        type="text"
        placeholder="Search employee by email..."
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
      />

      {loading && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
      )}

      <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
        {results.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer"
            onClick={() => handleAddMember(user._id)}
          >
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Add</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onClose}
          className="text-blue-600 dark:text-blue-400 underline text-sm  cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
