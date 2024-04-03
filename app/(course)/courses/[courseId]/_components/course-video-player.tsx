'use client';

import { cn } from '@/lib/utils';
import MuxPlayer from '@mux/mux-player-react';
import Video from 'next-video';
import { Loader2, Lock } from 'lucide-react';
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
        src={
          'https://utfs.io/f/d828a293-99c5-4a47-a4c2-786652744512-t5rn3i.mp4'
        }
      />
    </div>
  );
};
