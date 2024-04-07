'use client';
import { formatPrice } from '@/lib/format';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CourseProgress } from './course-progress';
import { IconBadge } from './icon-badge';
import { useLoader } from '@/hooks/useloader';

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

export const CourseCard = ({
  category,
  chaptersLength,
  id,
  imageUrl,
  price,
  progress,
  title,
}: CourseCardProps) => {
  const loader = useLoader();

  return (
    <Link 
    onClick={() => loader.setValue(40)}
     href={`/courses/${id}`}>
      <div className="group hover:shadow-xl hover:scale-105 tranistion overflow-hidden border rounded-lg p-3 h-full transition ease-in-out">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover " alt="title" src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2 ">
          <div className="text-lg md:text-base font-medium group-hover:text-purple-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs ">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={'sm'} icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress === 100 ? 'success' : 'default'}
            />
          ) : (
            <p className="text-base md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
