import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="w-screen h-screen p-4">
      <div className="h-full bg-background border rounded-[0.5rem] shadow">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
