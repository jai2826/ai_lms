'use client';

import { Category } from '@prisma/client';
import { IconType } from 'react-icons';
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcPuzzle,
  FcSalesPerformance,
  FcSportsMode,
} from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface ConfirmModalProps {
  items: Category[];
}

const iconMap: Record<Category['name'], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
  'Computer Science': FcMultipleDevices,
  Filming: FcFilmReel,
  Engineering: FcEngineering,
  'Game Design': FcPuzzle,
};

export const Preference = ({ items }: ConfirmModalProps) => {
  const user = useCurrentUser();

  const FormSchema = z.object({
    categories: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: 'You have to select at least one item.',
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: [],
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      console.log('first');
      await axios.post(`/api/user/${user?.id}/setpreference`, values);
      console.log('second');

      toast.success('User Preference Updated');

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  return (
    <div className="border-2  rounded-lg m-6 lg:m-24  py-10 z-50 h-full flex flex-col items-center justify-center">
      <Form {...form}>
        <h1 className='text-xl font-semibold '>
          What you wannna learn?
        </h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center flex-col justify-center"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 p-4 gap-4">
            {items.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="categories"
                render={({ field }) => {
                  const Icon = iconMap[item.name];
                  return (
                    <FormItem key={item.id}>
                      <FormControl>
                        <button
                          onClick={() => {
                            if (!field.value.includes(item.id)) {
                              field.onChange([...field.value, item.id]);
                            } else {
                              field.onChange(
                                field.value?.filter(
                                  (value) => value !== item.id
                                )
                              );
                            }
                          }}
                          className={cn(
                            'py-2 px-3  md:text-lg border border-slate-200 rounded-full flex items-center gap-x-1  hover:border-sky-700 transition min-w-full ',
                            field.value.includes(item.id) &&
                              'border-indigo-700 bg-black/10 text-indigo-800'
                          )}
                          type="button"
                        >
                          {Icon && <Icon size={20} />}
                          <div className="truncate">{item.name}</div>
                        </button>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            ))}
            <FormMessage />
          </div>
          <Button disabled={!form.formState.isValid} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
