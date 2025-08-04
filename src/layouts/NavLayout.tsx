import { useEffect, useState, type JSX } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/Auth';
import { useModal } from '../hooks/Modal';
import ModalContainer from '../components/modal/ModalContainer';
import api from '../utils/api';

export default function Layout(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, setUser } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const logout = (): void => {
    api.post('/auth/logout', {});
    setUser(null);
    setShowProfileMenu(false);
    navigate('/');
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = (): void => {
    setIsSidebarOpen(false);
  };

  const navLinkClasses =
    'block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-blue-900 ';

  const activeClasses = 'text-blue-600 font-semibold bg-blue-100 dark:hover:text-white';

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = (): void => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async (): Promise<void> => {
      if (!user) { return; }

      try {
        const res = await api.get('notifications/getNotifications');
        setUnreadCount(res.data || 0);
      } catch (err) {
        console.error('Error fetching notifications count:', err);
      }
    };

    fetchUnreadCount();
  }, [user]);

  return (
    <>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950 relative">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-[rgb(0,0,0,0.4)] z-20 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {user && (
          <aside
            className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 dark:text-gray-100 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
          >
            <div className="flex items-center justify-between p-4 font-bold text-2xl text-blue-700 dark:text-blue-400 cursor-pointer">
              <Link to="/">Taskify</Link>
              <button
                className="md:hidden text-gray-600 dark:text-gray-300"
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

              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={logout}
                  className="text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 w-full cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </nav>
          </aside>
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 shadow-md md:shadow-none relative">
            {user ? (
              <>
                <button
                  className="text-gray-700 dark:text-gray-200 md:invisible"
                  onClick={toggleSidebar}
                >
                  ☰
                </button>

                <div className="flex items-center gap-5 relative">

                  <button
                    onClick={toggleTheme}
                    className="ml-2 text-xl cursor-pointer"
                    title="Toggle Theme"
                  >
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>

                  <button
                    onClick={() => navigate('/notifications')}
                    className="relative text-xl text-gray-700 dark:text-gray-200 cursor-pointer"
                    title="Notifications"
                  >
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="flex items-center gap-2 focus:outline-none cursor-pointer"
                  >
                    <img
                      src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png"
                      alt="Profile"
                      className="h-8 w-8 rounded-full bg-gray-400"
                    />
                    <span className="text-gray-700 dark:text-gray-200">
                      {user.name ?? 'Profile'}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow rounded w-40 z-50">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 text-sm cursor-pointer"
                      >
                        <i className="fa fa-sign-out" aria-hidden="true"></i>
                        <span className="ps-2">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (

              <>
                <div className="text-blue-600 text-2xl ps-4 cursor-pointer">
                  <Link to="/">Taskify</Link>
                </div>

                <div className="hidden md:flex gap-2">
                  <button
                    onClick={toggleTheme}
                    className="ml-2 text-xl me-6"
                    title="Toggle Theme"
                  >
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                  <button
                    className="text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700"
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


          <main className="flex-1 overflow-y-auto p-4 dark:bg-gray-800">
            <Outlet />
          </main>
        </div>
      </div>

      <ModalContainer />
    </>
  );

}
