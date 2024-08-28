import Profile from '@/components/business/profile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';

function Home() {
  const date = dayjs().format('MMMM D, YYYY');
  return (
    <div className="h-full flex-col space-y-8 p-8 md:flex">
      <div className="flex justify-between items-center space-y-2">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Welcome back!</h3>
          <p className="text-muted-foreground"> {date}</p>
        </div>
        <Button variant="ghost" className="rounded-full h-8 w-8">
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </div>
      <Profile />
    </div>
  );
}

export default Home;
