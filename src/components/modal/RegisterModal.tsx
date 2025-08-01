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
    console.log('Register:', data);

    // TODO: Replace with your API call
    await api.post('/auth/register', data);

    onClose();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Get Started </h2>
      <p className="mb-6 text-gray-500 text-sm text-center">
        Fill in your details to create your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Name
          </label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-md px-4 py-2 transition"
            placeholder="Your name"
          />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-md px-4 py-2 transition"
            placeholder="you@example.com"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-md px-4 py-2 transition"
            placeholder="••••••••"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Role
          </label>
          <select
            {...register('role', { required: 'Role is required' })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-md px-4 py-2 transition text-gray-500"
          >
            <option value="" >Select a role</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
          {errors.role && (
            <span className="text-red-500 text-xs">{errors.role.message}</span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
