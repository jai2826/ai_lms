'use client';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Socials } from '@prisma/client';
import axios from 'axios';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { SocialsList } from './socials-list';
import { Switch } from '@/components/ui/switch';

interface SocialsFormProps {
  initialData: {
    socials: Socials[];
  };
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  name: z.string().min(1),
  link: z.string().min(1),
  socialsTypeId: z.string().min(1),
  position: z.optional(z.number()),
  courseId: z.optional(z.string()),
  id: z.optional(z.string()),
  isLocked: z.optional(z.boolean()),
});

export const SocialsForm = ({
  initialData,
  courseId,
  options,
}: SocialsFormProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    form.reset();
    setIsCreating((current) => !current);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      link: '',
      socialsTypeId: '',
      isLocked: true,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/socials`, values);

      toast.success('Social created');
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/socials/reorder`, {
        list: updateData,
      });

      toast.success('Socials reordered');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = async ({
    id,
    name,
    link,
    socialsTypeId,
    position,
    isLocked,
  }: {
    id: string;
    name: string;
    link: string;
    socialsTypeId: string;
    position: number;
    isLocked: boolean;
  }) => {
    form.setValue('name', name);
    form.setValue('link', link);
    form.setValue('socialsTypeId', socialsTypeId);
    form.setValue('position', position);
    form.setValue('id', id);
    form.setValue('isLocked', isLocked);
    setIsCreating(true);
  };

  const onDelete = async (id: string) => {
    try {
      setIsUpdating(true);
      await axios.delete(`/api/courses/${courseId}/socials/${id}`);

      toast.success('Social deleted');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center ">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        <span className="flex items-center">
          Course Socials
          <p className="text-muted-foreground text-xs ml-2 self-end">
            (If Locked, only Enrolled user can access this social)
          </p>
        </span>
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2 " />
              Add a Link
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Social 1' "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center">
                    Link
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'https://SocialLink1.com' "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialsTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center">
                    Social Type
                  </FormLabel>
                  <FormControl>
                    <Combobox options={options} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isLocked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center">
                    Locked
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    If Locked, only Enrolled user can access this social
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              {form.getValues('id') ? 'Save' : 'Create'}
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2 ',
            !initialData.socials.length && 'text-slate-500 italic'
          )}
        >
          {!initialData.socials.length ? (
            'No links'
          ) : (
            <SocialsList
              onDelete={onDelete}
              onEdit={onEdit}
              onReorder={onReorder}
              items={initialData.socials || []}
            />
          )}
        </div>
      )}
      {!isCreating && !initialData.socials && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};
