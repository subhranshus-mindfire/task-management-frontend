import type { ReactElement } from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function NavLayout(): ReactElement {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h1 className="text-xl font-bold mb-6">My Sidebar</h1>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/sessionstate1" className="hover:underline">Template 1</Link>
          <Link to="/sessionstate2" className="hover:underline">Template 2</Link>
          <Link to="/sessionstate3" className="hover:underline">Template 3</Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-200 p-4 flex justify-end">
          <div className="w-8 h-8 bg-gray-400 rounded-full" />
        </header>

        <main className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
