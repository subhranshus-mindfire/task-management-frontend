import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/Auth';
import type { JSX } from 'react';

export default function ProtectedRoute(): JSX.Element {
  const { user, loading } = useAuth();

  if (loading) {return <div>Loading...</div>;}

  return user ? <Outlet /> : <Navigate to="/" replace />;
}
