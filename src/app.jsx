import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { PouchDBProvider } from './hooks/use-pouch-db';
import routes from './routes';

// Create a query client
const queryClient = new QueryClient();

function App() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <>
      <RouterProvider router={createBrowserRouter(routes, { basename })} />
      <Toaster />
    </>
  );
}

export default function WrappedApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <PouchDBProvider>
        <App />
      </PouchDBProvider>
    </QueryClientProvider>
  );
}
