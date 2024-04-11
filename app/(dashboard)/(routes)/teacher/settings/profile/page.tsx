'use client';
import { TeacherProfile } from '@/actions/teacher-profile';
import { FileUpload } from '@/components/file-upload';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getTeacherByUserId } from '@/data/teacher';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useTeacher } from '@/hooks/useTeacher';
import { currentTeacher } from '@/lib/currentTeacher';
import { TeacherProfileSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Teacher } from '@prisma/client';
import { HelpCircle, ImageIcon, Settings, Upload, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const TeacherProfilePage = () => {
  const { update } = useSession();
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const teacher = useTeacher();
  const router = useRouter();
  const form = useForm<z.infer<typeof TeacherProfileSchema>>({
    resolver: zodResolver(TeacherProfileSchema),
    defaultValues: {
      name: teacher?.name || undefined,
      email: teacher?.email || undefined,
      phone: teacher?.phone || '',
      image: teacher?.image || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof TeacherProfileSchema>) => {
    console.log(values);
    startTransition(() => {
      if (
        form.getValues('name') === teacher?.name &&
        form.getValues('email') === teacher?.email &&
        form.getValues('image') === teacher?.image &&
        form.getValues('phone') === teacher?.phone
      ) {
        toast.success('All fields are up to data');
        router.refresh();
        return;
      }
      TeacherProfile(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            form.reset();
          }
          if (data.success) {
            update();
            toast.success(data.success);
            setToggleEdit(false);
          }
          router.refresh();
        })
        .catch(() => setError('Something went wrong!'));
    });
  };
  const cancelImageForm = () => {
    form.setValue('image', teacher?.image || undefined);
    setToggleEdit(false);
  };

  return (
    <Card className="lg:w-[550px] xl:w-[800px] 2xl:w-[1000px] mx-auto border-none">
      <CardHeader>
        <p className="text-2xl  flex  items-center md:justify-center font-semibold text-center">
          <Settings className="h-8 w-8 mr-2 " />
          Settings
        </p>
      </CardHeader>
      <CardContent className=" ">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem className="flex flex-col items-center justify-center ">
                    <FormLabel className="flex items-center justify-between w-full">
                      <span className="text-xl">
                        Profile{' '}
                        {form.getValues('image') !== teacher?.image &&
                          form.getValues('image') !== undefined &&
                          '🟢'}
                      </span>
                      {!toggleEdit ? (
                        <Button
                          onClick={() => setToggleEdit((prev) => !prev)}
                          className="flex rounded-md"
                          type="button"
                        >
                          Upload
                          <Upload className="ml-1 " />
                        </Button>
                      ) : (
                        <Button
                          onClick={cancelImageForm}
                          className="flex rounded-md"
                          type="button"
                        >
                          Cancel <XCircle className="ml-1 " />
                        </Button>
                      )}
                    </FormLabel>
                    <FormControl className="flex items-center justify-center w-full">
                      <>
                        {!toggleEdit &&
                          (!teacher?.image ? (
                            <div className="flex items-center justify-center rounded-full w-40 h-40 bg-slate-200 ">
                              <ImageIcon className="h-10 w-10" />
                            </div>
                          ) : (
                            <div className="relative h-40 w-40 mt-2 rounded-full overflow-hidden">
                              <Image
                                alt="Upload"
                                fill
                                className="object-cover rounded-full"
                                src={teacher.image}
                              />
                            </div>
                          ))}
                        {toggleEdit && (
                          <div>
                            <FileUpload
                              endpoint="teacherImage"
                              onChange={(url) => {
                                if (url) {
                                  form.setValue('image', url);
                                }
                              }}
                            />

                            <div className="text-xs text-muted-foreground mt-4">
                              16:9 aspect ration recommended
                            </div>
                          </div>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg flex items-center">
                      <span>
                        Name
                        {form.getValues('name') !== teacher?.name && '🟢'}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg flex items-center">
                      <span>
                        Email
                        {form.getValues('email') !== teacher?.email && '🟢'}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Johndoe@gmail.com"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg flex items-center">
                      <span>
                        Phone
                        {form.getValues('phone') !== teacher?.phone && '🟢'}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="95*******5"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormError message={error} />

              <span className="flex items-center space-x-2">
                <Button disabled={isPending} type="submit">
                  Save
                </Button>
                <Button
                  onClick={() => {
                    form.setValue('name', teacher?.name || undefined);
                    form.setValue('email', teacher?.email || undefined);
                    form.setValue('image', teacher?.image || undefined);
                    cancelImageForm();
                    form.setValue('phone', teacher?.phone || '');
                  }}
                  type="button"
                >
                  Cancel
                </Button>
              </span>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default TeacherProfilePage;
