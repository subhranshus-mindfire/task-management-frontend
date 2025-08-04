import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../ui/toast/use-toast';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import type { ToastVariantTypes } from '../ui/toast/types';


interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginModal({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const navigate = useNavigate();

  const { setUser } = useAuth();

  const toast = useToast();

  const showNotification = (msg: string, type: ToastVariantTypes) => {
    toast.addToast({
      message: msg,
      variant: type,
      animation: 'slide',
      mode: 'light',
      icon: <CheckCircledIcon />,
    });
  };


  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await api.post('/auth/login', data);
      const newRes = await api.get('/auth/me');
      console.log(newRes.data);
      setUser(newRes.data);
      onClose();
      navigate('/');
      showNotification('Login Success','success');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Welcome Back</h2>
      <p className="mb-6 text-gray-500 text-sm text-center">
        Please enter your credentials to log in.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            Login
          </button>
        </div>
      </form>
    </div>

  );
}
