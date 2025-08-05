import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../ui/toast/use-toast';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import type { ToastVariantTypes } from '../ui/toast/types';
import type { AxiosError } from 'axios';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginModal({ onClose, theme }: {
  onClose: () => void, theme?: 'light' | 'dark';
}): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const toast = useToast();

  console.log(theme);

  const showNotification = (msg: string, type: ToastVariantTypes): void => {
    toast.addToast({
      message: msg,
      variant: type,
      animation: 'slide',
      mode: 'light',
      appearance: theme === 'dark' ? 'glow' : 'premium',
      icon: <CheckCircledIcon />,
    });
  };

  const onSubmit = async (data: LoginFormInputs): Promise<void> => {
    try {
      await api.post('/auth/login', data);
      const newRes = await api.get('/auth/me');
      setUser(newRes.data);
      onClose();
      navigate('/');
      showNotification('Logged In Successfully', 'success');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error?.response?.data?.message) {
        showNotification(error.response.data.message, 'error');
      } else {
        showNotification('Something went wrong. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100 text-center">
        Welcome Back
      </h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400 text-sm text-center">
        Please enter your credentials to log in.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:focus:ring-blue-800 rounded-md px-4 py-2 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="you@example.com"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:focus:ring-blue-800 rounded-md px-4 py-2 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="••••••••"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password.message}</span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:underline cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition  cursor-pointer"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
