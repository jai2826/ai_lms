'use client';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { allTeacherData, allUsersData } from '@/data/all-users-data';
import { db } from '@/lib/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().min(1, {
    message: 'Please choose a email',
  }),
});

const TeacherCreatePage = () => {
  const router = useRouter();
  const [options, setOptions] = useState<any>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    try {
      const response = await axios.post('/api/teacher', values);
      router.push(`/admin/teacher/${response.data.id}`);
      toast.success('Teacher created');
    } catch {
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    const createOptions = async () => {
      const usersList = await allUsersData();
      if (!usersList) {
        toast.error('Something went wrong');
        return;
      }
      const teacherList = await allTeacherData();
      const userNotTeacher = usersList.filter(
        (user) => !teacherList?.some((teacher) => teacher.email === user.email)
      );
      const data = userNotTeacher.map((item) => {
        return {
          value: item.email,
          label: item.email,
        };
      });
      setOptions(data);
    };
    createOptions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Search by user email</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher email</FormLabel>
                  <FormControl>
                    {options && <Combobox options={options} {...field} />}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2 ">
              <Link href={'/'}>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TeacherCreatePage;
