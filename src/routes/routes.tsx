import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom';
import App from '../App';
import NavLayout from '../layouts/NavLayout';
import MyProjects from '../pages/MyProjects';
import ProjectDetails from '../pages/ProjectDetails';
import Notifications from '../pages/Notifications';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavLayout />}>
      <Route index element={<App />} />
      <Route path="/projects" element={<MyProjects />} />
      <Route path="/projects/:projectId" element={<ProjectDetails />} />
      <Route path="/notifications" element={<Notifications />} />
    </Route>,
  ),
);

export default router;
