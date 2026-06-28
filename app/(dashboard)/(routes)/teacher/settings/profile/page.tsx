'use client';

import { TeacherProfile } from '@/actions/teacher-profile';
import { FileUpload } from '@/components/file-upload';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTeacher } from '@/hooks/useTeacher';
import { TeacherProfileSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Settings, Upload, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const TeacherProfilePage = () => {
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
        toast.success('All fields are up to date');
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
            toast.success(data.success);
            setToggleEdit(false);
            window.location.reload();
          }
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
        <p className="text-2xl flex items-center md:justify-center font-semibold text-center">
          <Settings className="h-8 w-8 mr-2 " />
          Settings
        </p>
      </CardHeader>
      <CardContent className=" ">
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Controller
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex flex-col items-center justify-center ">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xl font-medium">
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
                  </div>
                  <div className="flex items-center justify-center w-full mt-2">
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
                          16:9 aspect ratio recommended
                        </div>
                      </div>
                    )}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="text-lg flex items-center">
                    <span>
                      Name
                      {form.getValues('name') !== teacher?.name && '🟢'}
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="text-lg flex items-center">
                    <span>
                      Email
                      {form.getValues('email') !== teacher?.email && '🟢'}
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Johndoe@gmail.com"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="text-lg flex items-center">
                    <span>
                      Phone
                      {form.getValues('phone') !== teacher?.phone && '🟢'}
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="95*******5"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
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
      </CardContent>
    </Card>
  );
};

export default TeacherProfilePage;
