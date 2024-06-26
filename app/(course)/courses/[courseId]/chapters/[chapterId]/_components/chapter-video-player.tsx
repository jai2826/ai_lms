'use client';

import { Player } from '@/components/video-player/player';
import { useConfettiStore } from '@/hooks/useConfettiStore';
import { useLoader } from '@/hooks/useloader';
import axios from 'axios';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  src: string;
}
export const VideoPlayer = ({
  chapterId,
  completeOnEnd,
  courseId,
  isLocked,
  playbackId,
  title,
  src,
  nextChapterId,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();
  const loader = useLoader();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          { isCompleted: true }
        );
      }

      if (!nextChapterId) {
        confetti.onOpen();
      }

      toast.success('Progress Updated');
      router.refresh();

      if (nextChapterId) {
        loader.setValue(40);
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8 " />
          <p className="text-sm">This chapter is Locked</p>
        </div>
      )}
      {!isLocked && (
        <Player
          title={title}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          src={src}
        />
      )}
    </div>
  );
};
