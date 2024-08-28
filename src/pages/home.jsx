import Profile from '@/components/business/profile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { usePouchDB } from '../hooks/use-pouch-db';

function Home() {
  const date = dayjs().format('YYYY-MM-DD');
  const db = usePouchDB();

  const { data } = useQuery({
    queryKey: ['getProfile'],
    queryFn: async () => {
      const user = await sessionStorage.getItem('user');
      const userInfo = await JSON.parse(user);
      const { _id } = userInfo;
      const result = await db.get(_id);
      return result ?? {};
    },
  });

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="h-full flex-col space-y-8 p-4 md:p-8 md:flex overflow-scroll">
      <div className="flex justify-between items-center space-y-2">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Welcome back!</h3>
          <p className="text-muted-foreground"> {date}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-8 w-8">
              <Avatar>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Profile profile={data} />
    </div>
  );
}

export default Home;
