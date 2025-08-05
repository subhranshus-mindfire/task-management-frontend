import type { JSX } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 dark:text-white">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
        Go back to home
      </Link>
    </div>
  );
}
