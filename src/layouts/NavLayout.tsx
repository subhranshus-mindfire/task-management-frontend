import { useState, type JSX } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/Auth';
import { useModal } from '../hooks/Modal';
import ModalContainer from '../components/modal/ModalContainer';
import api from '../utils/api';


export default function Layout(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, setUser } = useAuth();
  const { openModal } = useModal();

  const logout = () => {
    api.post('/auth/logout', {});
    setUser(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navLinkClasses =
    'block py-2 px-3 rounded hover:bg-blue-100';

  const activeClasses = 'text-blue-600 font-semibold bg-blue-100';

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-[rgb(0,0,0,0.4)] z-20 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {user ? (
          <aside
            className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
          >
            <div className="flex items-center justify-between p-4 font-bold text-xl">
              Taskify
              <button
                className="md:hidden text-gray-600"
                onClick={closeSidebar}
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col justify-between p-4 h-[90%]">
              <div className="flex flex-col space-y-2">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `${navLinkClasses} ${isActive ? activeClasses : ''}`
                  }
                  onClick={closeSidebar}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `${navLinkClasses} ${isActive ? activeClasses : ''}`
                  }
                  onClick={closeSidebar}
                >
                  My Projects
                </NavLink>
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    `${navLinkClasses} ${isActive ? activeClasses : ''}`
                  }
                  onClick={closeSidebar}
                >
                  My Notifications
                </NavLink>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={logout}
                  className="text-red-600 border border-red-600 rounded px-4 py-2 hover:bg-red-50 w-full"
                >
                  Logout
                </button>
              </div>
            </nav>
          </aside>

        ) : (
          <></>
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className={`flex items-center ${!user ? 'justify-between' : 'justify-end'} bg-white px-4 py-3 shadow-md md:shadow-none`}>
            <button
              className="text-gray-700 md:hidden"
              onClick={toggleSidebar}
            >
              ☰
            </button>
            {user ? (
              <div className='flex items-center gap-3'>
                <div className="h-8 w-8 rounded-full bg-gray-400"></div>
                <span className="text-gray-700">{user.name ?? 'Profile'}</span>
              </div>
            ) : (
              <>
                <div className="text-blue-600 text-2xl ps-4 cursor-pointer">
                  <Link to="/">Taskify</Link>
                </div>

                <div className="hidden md:flex gap-2">
                  <button
                    className="text-blue-600 border border-blue-600 rounded px-4 py-2 hover:bg-blue-50"
                    onClick={() => openModal('login')}
                  >
                    Login
                  </button>
                  <button
                    className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
                    onClick={() => openModal('register')}
                  >
                    Get Started
                  </button>
                </div>
              </>
            )}

          </header>

          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>

      <ModalContainer />
    </>
  );
}
