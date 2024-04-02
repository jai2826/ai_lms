'use client';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Teacher } from '@prisma/client';
import axios from 'axios';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface ImageFormProps {
  initialData: Teacher;
  teacherId: string;
}

const formSchema = z.object({
  image: z.string().min(1, {
    message: 'Image is required',
  }),
});

export const ImageForm = ({ initialData, teacherId }: ImageFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: initialData?.image || '',
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log('error1')
    try {
      // console.log('error2')
      await axios.patch(`/api/teacher/${teacherId}`, values);
      toast.success('Teacher details updated');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };
  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Teacher Image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.image && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.image && (
            <>
              <Pencil className="h-4 w-4 mr-2 " />
              Edit Image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.image ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.image}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="teacherImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ image: url });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            1:1 aspect ration recommended
          </div>
        </div>
      )}
    </div>
  );
};
