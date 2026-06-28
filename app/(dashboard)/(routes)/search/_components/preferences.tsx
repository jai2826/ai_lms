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
  Field,
  FieldError,
  FieldSet,
} from '@/components/ui/field';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
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

const FormSchema = z.object({
  categories: z
    .array(z.string())
    .min(1, { message: 'You have to select at least one item.' }),
});

export const Preference = ({ items }: ConfirmModalProps) => {
  const user = useCurrentUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      categories: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await axios.post(`/api/user/${user?.id}/setpreference`, values);
      toast.success('User Preference Updated');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  return (
    <div className="border-2 rounded-lg m-6 lg:m-24 py-10 z-50 h-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold mb-6">
        What you wanna learn?
      </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center flex-col justify-center"
      >
        <Controller
          control={form.control}
          name="categories"
          render={({ field, fieldState }) => (
            <FieldSet>
              <div className="grid grid-cols-2 lg:grid-cols-3 p-4 gap-4">
                {items.map((item) => {
                  const Icon = iconMap[item.name];
                  const isSelected = field.value?.includes(item.id);
                  return (
                    <Field key={item.id} data-invalid={fieldState.invalid}>
                      <button
                        onClick={() => {
                          const next = isSelected
                            ? field.value.filter((v: string) => v !== item.id)
                            : [...(field.value || []), item.id];
                          field.onChange(next);
                        }}
                        className={cn(
                          'py-2 px-3 md:text-lg border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition min-w-full',
                          isSelected && 'border-indigo-700 bg-black/10 text-indigo-800'
                        )}
                        type="button"
                      >
                        {Icon && <Icon size={20} />}
                        <div className="truncate">{item.name}</div>
                      </button>
                    </Field>
                  );
                })}
              </div>
              {fieldState.invalid && (
                <div className="text-center">
                  <FieldError errors={[fieldState.error]} />
                </div>
              )}
            </FieldSet>
          )}
        />
        <Button disabled={!form.formState.isValid} type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
};
