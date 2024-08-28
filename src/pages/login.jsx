import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  const form = useForm({
    defaultValues,
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    setTimeout(() => {
      console.warn(data);
    }, 1000);
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
          <Button type="submit" className="w-full" onClick={form.handleSubmit(onSubmit)}>
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
