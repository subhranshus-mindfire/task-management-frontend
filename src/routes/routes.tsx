import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom';
import App from '../App';
import NavLayout from '../layouts/NavLayout';
import MyProjects from '../pages/MyProjects';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavLayout />}>
      <Route index element={<App />} />
      <Route path="/projects" element={<MyProjects />} />
    </Route>,
  ),
);

export default router;
