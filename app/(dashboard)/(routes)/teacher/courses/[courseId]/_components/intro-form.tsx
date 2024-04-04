'use client';

import Video from 'next-video';
import * as z from 'zod';
import axios from 'axios';
import { Pencil, PlusCircle, ImageIcon, VideoIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Course, MuxDataCourse } from '@prisma/client';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { onSubmitUpdateData } from '@/lib/update-data';
import MuxPlayer from '@mux/mux-player-react';
import { cn } from '@/lib/utils';
import { CourseVideoPlayer } from '@/app/(course)/courses/[courseId]/_components/course-video-player';

interface IntroFormProps {
  initialData: Course & {
    muxData: MuxDataCourse;
  };
  courseId: string;
}

const formSchema = z.object({
  introUrl: z.string().min(1, {
    message: 'Intro video is required',
  }),
});

export const IntroForm = ({ initialData, courseId }: IntroFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Introduction
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.introUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.introUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2 " />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.introUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            {/* <MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} /> */}
            <CourseVideoPlayer
              title={initialData.title}
              courseId={courseId}
              playbackId={initialData.muxData?.playbackId!}
              src={initialData.introUrl!}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseIntro"
            onChange={(url) => {
              if (url) {
                onSubmit({ introUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload the course Intro
          </div>
        </div>
      )}
      {initialData.introUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2 ">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};
