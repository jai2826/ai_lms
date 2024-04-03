'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import Video from 'next-video';
import { useState } from 'react';

interface CourseVideoPlayerProps {
  playbackId: string;
  courseId: string;
  title: string;
  src: string;
}
export const CourseVideoPlayer = ({
  courseId,
  playbackId,
  title,
  src,
}: CourseVideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative aspect-video">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}

      <Video
        title={title}
        className={cn(!isReady && 'hidden')}
        onCanPlay={() => setIsReady(true)}
        autoPlay
        src={src}
      />
    </div>
  );
};
