'use client';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox-legacy';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import { allTeacherData, allUsersData } from '@/data/all-users-data';
import { useLoader } from '@/hooks/useloader';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().min(1, {
    message: 'Please select a user email address.',
  }),
});

const TeacherCreatePage = () => {
  const router = useRouter();
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const loader = useLoader();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      loader.setValue(40);
      const response = await axios.post('/api/teacher', values);
      loader.setValue(70);
      router.push(`/admin/teacher/${response.data.id}`);
      toast.success('Teacher created successfully');
      loader.setValue(100);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    const createOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const usersList = await allUsersData();
        if (!usersList) {
          toast.error('Failed to load users directory');
          return;
        }
        const teacherList = await allTeacherData();
        const userNotTeacher = usersList.filter(
          (user) => !teacherList?.some((teacher) => teacher.email === user.email)
        );
        const data = userNotTeacher.map((item) => ({
          value: item.email,
          label: item.email,
        }));
        setOptions(data);
      } catch (error) {
        toast.error('Failed to compile user directory list');
        console.error(error);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    createOptions();
  }, []);

  return (
    <div className="max-w-xl mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
      <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Add New Teacher</h1>
          <p className="text-sm text-slate-500 mt-1">
            Search and select a registered user by email to assign them the Teacher role.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-slate-700">
                  Teacher Email
                </FieldLabel>
                {isLoadingOptions ? (
                  <div className="flex items-center gap-x-2 text-sm text-slate-500 py-2 border border-slate-200 rounded-md px-3 bg-slate-50 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Loading user directory...
                  </div>
                ) : (
                  <Combobox
                    options={options}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
                <FieldDescription className="text-xs text-slate-500">
                  Only users who are not already teachers will be listed.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex items-center justify-end gap-x-3 pt-2">
            <Link href="/admin/teacher">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherCreatePage;
