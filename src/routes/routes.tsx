import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom';
import App from '../App';
import NavLayout from '../layouts/NavLayout';
import MyProjects from '../pages/MyProjects';
import ProjectDetails from '../pages/ProjectDetails';
import Notifications from '../pages/Notifications';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavLayout />}>
      <Route index element={<App />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default router;
