
import { type JSX } from 'react';
import { useModal } from '../hooks/Modal';

export default function LandingPage(): JSX.Element {
  const { openModal } = useModal();

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 max-w-8xl mx-auto">
        <div className="">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Manage your tasks like a pro with <span className="text-blue-600">Taskify</span>
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Organize your projects, track deadlines, collaborate with your team, and never miss a task again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => openModal('register')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => openModal('login')}
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md text-lg hover:bg-blue-50 transition"
            >
              Login
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://projectsly.com/images/task-management-system-screenshot-1.png?v=1691124479409199525"
            alt="Task Management Illustration"
            className="w-full max-w-lg"
          />
        </div>
      </section>

      <section className="bg-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why choose Taskify?</h2>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <i className="fas fa-check-circle text-blue-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Stay Organized</h3>
              <p className="text-gray-600">
                Easily create projects, assign tasks, and monitor progress from a single dashboard.
              </p>
            </div>
            <div className="text-center">
              <i className="fas fa-users text-blue-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
              <p className="text-gray-600">
                Work seamlessly with your team, assign members, and communicate effectively.
              </p>
            </div>
            <div className="text-center">
              <i className="fas fa-bell text-blue-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Get Notified</h3>
              <p className="text-gray-600">
                Receive timely reminders so you never miss a deadline or important update.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 px-8 text-center">
        <p className="text-gray-500">© {new Date().getFullYear()} Taskify. All rights reserved.</p>
      </footer>
    </main>
  );
}
