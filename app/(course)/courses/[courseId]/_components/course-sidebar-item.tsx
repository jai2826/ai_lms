'use client';

import { useLoader } from '@/hooks/useloader';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const loader = useLoader();
  const isActive = pathname?.includes(id);
  const onClick = () => {
    loader.setValue(40);
    router.push(`/courses/${courseId}/chapters/${id}`);
  };
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'flex items-center gap-x-2 text-purple-500 text-sm font-[500] pl-6 transition-all hover:text-purple-600 hover:bg-slate-300/20 group',
        isActive &&
          'text-purple-500 bg-purple-200/20 hover:bg-slate-200/20 hover:text-indigo-700',
        isCompleted && 'text-emerald-700 hover:text-emerald-700',
        isCompleted && isActive && 'bg-emerald-200/20 '
      )}
    >
      <div className="flex items-center gap-x-2 py-4 group-hover:scale-125 transition">
        <Icon
          size={22}
          className={cn(
            'text-purple-500',
            isActive && 'text-purple-700',
            isCompleted && 'text-emerald-700'
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-purple-700 h-full transition-all',
          isActive && 'opacity-100 ',
          isCompleted && 'border-emerald-700'
        )}
      />
    </button>
  );
};
