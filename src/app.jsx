import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Layout from './layouts/layout';
import Home from './pages/home';
import Login from './pages/login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <Router basename={basename}>
      <App />
    </Router>
  );
}
