'use client';

import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { SearchInput } from './search-input';
import { UserButton } from './auth/user-button';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Teacher } from '@prisma/client';
import { allTeacherData } from '@/data/all-users-data';

export const NavbarRoutes = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const session = useSession();
  const userId = session.data?.user.id;
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!userId) {
        return;
      }
      const teacherData = await allTeacherData();
      const newTeacher = teacherData?.find((item) => item.userId === userId);
      setTeacher(newTeacher!);
    };
    fetchTeacher();
  }, [userId]);

  const isAdmin = session.data?.user.role === 'ADMIN';
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage =
    pathname?.includes('/course') && !pathname?.startsWith('/admin');
  const isSearchPage = pathname === '/search';
  // const
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      {
        <div className="flex gap-x-2 ml-auto">
          {(isTeacherPage || isCoursePage) && (
            <Link href={'/'}>
              <Button size={'sm'} variant={'ghost'}>
                <LogOut className="h-4 w-4" />
                Exit
              </Button>
            </Link>
          )}
          {teacher && (!isTeacherPage || !isCoursePage) && (
            <Link href={'/teacher/courses'}>
              <Button size="sm" variant="ghost">
                Teacher mode
              </Button>
            </Link>
          )}

          {isAdmin && (
            <Link href={'/admin/teacher'}>
              <Button size="sm" variant="ghost">
                Admin mode
              </Button>
            </Link>
          )}
          <UserButton />
        </div>
      }
    </>
  );
};
