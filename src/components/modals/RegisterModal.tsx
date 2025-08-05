import { useForm, type SubmitHandler } from 'react-hook-form';
import type { JSX } from 'react';
import api from '../../utils/api';

interface RegisterModalProps {
  onClose: () => void;
}

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'employee';
}

export default function RegisterModal({ onClose }: RegisterModalProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    await api.post('/auth/register', data);
    onClose();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100 text-center">
        Get Started
      </h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400 text-sm text-center">
        Fill in your details to create your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:focus:ring-blue-800 rounded-md px-4 py-2 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="Your name"
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:focus:ring-blue-800 rounded-md px-4 py-2 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="you@example.com"
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:focus:ring-blue-800 rounded-md px-4 py-2 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="••••••••"
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            id="role"
            {...register('role', { required: 'Role is required' })}
            className="w-full border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:focus:ring-blue-800 rounded-md px-4 py-2 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          >
            <option value="">Select a role</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
          {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
        </div>

        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:underline  cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition cursor-pointer"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
