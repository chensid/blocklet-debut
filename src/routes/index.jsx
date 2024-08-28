import { Navigate } from 'react-router-dom';

import Layout from '../layouts/layout';
import Home from '../pages/home';
import Login from '../pages/login';
import authLoader from '../utils/util';

const routes = [
  {
    path: '/',
    element: <Layout />,
    loader: authLoader,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
];

export default routes;
