import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { usePouchDB } from '../../hooks/use-pouch-db';

const profileSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(40, 'Username must be less than 40 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s\-+()]+$/, 'Please enter a valid phone number'),
  gender: z.enum(['male', 'female', 'other']).default('male'),
  address: z.string().max(100, 'Address must be less than 100 characters'),
  bio: z.string().max(150, 'Bio must be less than 150 characters'),
});

const defaultProfile = {
  email: '',
  username: '',
  phone: '',
  gender: 'male',
  address: '',
  bio: '',
};

const Profile = memo(({ profile }) => {
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const db = usePouchDB();
  const form = useForm({
    defaultValues: profile || defaultProfile,
    resolver: zodResolver(profileSchema),
  });
  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const doc = await db.get(profile._id);
      const updatedDoc = {
        ...doc,
        ...data,
      };
      const res = await db.put(updatedDoc);
      if (!res.ok) {
        throw new Error('Failed to update profile');
      }
      return res;
    },
    onSuccess: () => {
      toast({
        title: 'Profile updated successfully',
      });
      setIsEdit(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update profile',
        description: String(error),
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset(profile);
    }
  }, [form, profile]);

  const onSubmit = (data) => {
    form.reset(data);
    mutate(data);
  };
  const handleEdit = () => {
    setIsEdit(!isEdit);
  };
  const handleCancel = () => {
    setIsEdit(false);
    form.reset();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>profile description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="flex flex-col md:gap-3 md:flex-row">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.email}>Email</FormLabel>
                    <FormControl>
                      <Input
                        id={field.email}
                        type="email"
                        placeholder="Please enter your email"
                        autoComplete="off"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.username}>Username</FormLabel>
                    <FormControl>
                      <Input
                        id={field.username}
                        type="text"
                        placeholder="Please enter your username"
                        autoComplete="off"
                        disabled={!isEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col md:gap-3 md:flex-row">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.phone}>Phone</FormLabel>
                    <FormControl>
                      <Input
                        id={field.phone}
                        type="tel"
                        placeholder="Please enter your phone"
                        autoComplete="off"
                        disabled={!isEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.gender}>Gender</FormLabel>
                    <Select
                      id={field.gender}
                      disabled={!isEdit}
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.address}>Address</FormLabel>
                <FormControl>
                  <Input
                    id={field.address}
                    type="text"
                    placeholder="Please enter your address"
                    autoComplete="off"
                    disabled={!isEdit}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.bio}>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    id={field.bio}
                    placeholder="Please enter your bio"
                    autoComplete="off"
                    disabled={!isEdit}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isEdit ? (
          <>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
          </>
        ) : (
          <Button onClick={handleEdit}>Edit</Button>
        )}
      </CardFooter>
    </Card>
  );
});

export default Profile;
