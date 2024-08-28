import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}

export default Layout;
