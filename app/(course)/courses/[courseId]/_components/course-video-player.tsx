'use client';

import { Player } from '@/components/video-player/player';
import { Loader2 } from 'lucide-react';
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
      {<Player autoPlay={true} src={src} title={title} />}
    </div>
  );
};
