import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import sha256 from 'crypto-js/sha256';
import { nanoid } from 'nanoid';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { usePouchDB } from '../hooks/use-pouch-db';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be less than 32 characters long'),
});

const defaultValues = {
  email: 'demo@example.com',
  password: 'password',
};

function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const db = usePouchDB();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      // find user by email
      const res = await db.find({ selector: { type: 'user', email: data.email } });
      if (res.docs.length < 1) {
        throw new Error('user not exist');
      }
      const user = res.docs[0];
      // check password
      if (user.password !== data.password) {
        throw new Error('email or password is incorrect');
      }
      // fake token
      const token = nanoid();
      // remove password
      const { password, ...returnUser } = user;
      // return user and token
      return { user: returnUser, token };
    },
    onSuccess: (result) => {
      // save token to localStorage
      const { user, token } = result;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      // navigate to home page
      navigate('/', { replace: true });
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: String(error),
        variant: 'destructive',
      });
    },
  });

  const form = useForm({
    defaultValues,
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    mutate({ ...data, password: sha256(data.password).toString() });
  };
  return (
    <div className="bg-background w-full h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Form {...form}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Email</FormLabel>
                  <FormControl>
                    <Input id={field.name} type="email" placeholder="m@example.com" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Password</FormLabel>
                  <FormControl>
                    <Input id={field.name} type="password" required placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPending} onClick={form.handleSubmit(onSubmit)}>
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
