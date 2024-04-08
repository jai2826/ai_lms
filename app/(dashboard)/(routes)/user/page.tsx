'use client';
import { Profile } from '@/actions/profile';
import { FileUpload } from '@/components/file-upload';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ProfileSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle, ImageIcon, Settings, Upload, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const ProfilePage = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [enable, setEnable] = useState<boolean>(true);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      image: user?.image || undefined,
      password: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    startTransition(() => {
      if (!form.formState.isDirty) {
        toast.success('All fields are up to data');
        router.refresh();

        return;
      }
      Profile(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            form.reset();
            form.setValue('password', '');
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
    form.setValue('image', user?.image || undefined);
    setToggleEdit(false);
  };

  return (
    <Card className="lg:w-[750px] xl:w-[1000px] mx-auto border-none">
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
                        {form.getValues('image') !== user?.image && '🟢'}
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
                          (!user?.image ? (
                            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                              <ImageIcon className="h-10 w-10" />
                            </div>
                          ) : (
                            <div className="relative h-40 w-40 mt-2 rounded-full overflow-hidden">
                              <Image
                                alt="Upload"
                                fill
                                className="object-cover rounded-full"
                                src={user.image}
                              />
                            </div>
                          ))}
                        {toggleEdit && (
                          <div>
                            <FileUpload
                              endpoint="userImage"
                              onChange={(url) => {
                                if (url) {
                                  form.setValue('image', url);
                                }
                              }}
                            />

                            <div className="text-xs text-muted-foreground mt-4">
                              1:1 aspect ratio recommended
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
                        {form.getValues('name') !== user?.name && '🟢'}
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
                        {form.getValues('email') !== user?.email && '🟢'}
                      </span>
                      {user?.isOAuth && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger type="button">
                              <HelpCircle className="ml-2 h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                This field is handled by your OAuth provider
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Johndoe@gmail.com"
                        disabled={isPending || user!.isOAuth}
                      />
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
                    <FormLabel className="text-lg flex items-center">
                      <span>
                        Password
                        {form.getValues('password') && '🟢'}
                      </span>
                      {user?.isOAuth && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger type="button">
                              <HelpCircle className="ml-2 h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                This field is handled by your OAuth provider
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="******"
                        disabled={isPending || user!.isOAuth}
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
                  disabled={isPending}
                  onClick={() => {
                    form.setValue('name', user?.name || undefined);
                    form.setValue('email', user?.email || undefined);
                    form.setValue('image', user?.image || undefined);
                    cancelImageForm();
                    form.setValue('password', undefined);
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
export default ProfilePage;
