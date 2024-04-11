import { auth } from '@/auth';
import { CourseProgress } from '@/components/course-progress';
import { db } from '@/lib/db';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { redirect } from 'next/navigation';
import { CourseSidebarItem } from './course-sidebar-item';

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return redirect('/');
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b ">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10 ">
            <CourseProgress variant={'success'} value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
      <div className='p-2'>
        <h1 className='text-2xl '>Prerequisites</h1>
        To enroll in the course 
        <ul>
          <li>Test Card From stripe: 4000003560000008</li>
          <li>Expiry Date: any, should be greater than 05/2024 </li>
          <li>Rest data: any, of your choice </li>
        </ul>
      </div>
    </div>
  );
};
