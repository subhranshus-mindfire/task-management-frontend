import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom';
import App from '../App';
import NavLayout from '../layouts/NavLayout'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavLayout />}>
      <Route index element={<App />} />
    </Route>
  )
);

export default router;
