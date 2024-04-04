'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { SearchInput } from './search-input';
import { UserButton } from './auth/user-button';
import { useSession } from 'next-auth/react';
import { useLoader } from '@/hooks/useloader';
import { useTeacher } from '@/hooks/useTeacher';

export const NavbarRoutes = () => {
  const session = useSession();
  const userId = session.data?.user.id;
  let teacher = useTeacher();

  if (teacher?.userId !== userId) teacher = undefined;

  const isAdmin = session.data?.user.role === 'ADMIN';
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage =
    pathname?.includes('/courses') && !pathname?.startsWith('/admin');

  const isSearchPage = pathname === '/search';
  const router = useRouter();
  const loader = useLoader();
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
            <Button
              onClick={() => {
                loader.setValue(40);
                router.push('/search');
                loader.setValue(100);
              }}
              size={'sm'}
              variant={'ghost'}
            >
              <LogOut className="h-4 w-4" />
              Exit
            </Button>
          )}
          {teacher && !isTeacherPage && (
            <Button
              onClick={() => {
                loader.setValue(40);
                router.push('/teacher/courses');
                loader.setValue(100);
              }}
              size="sm"
              variant="ghost"
            >
              Teacher mode
            </Button>
          )}

          {isAdmin && (
            <Button
              onClick={() => {
                loader.setValue(40);
                router.push('/admin/teacher');
                loader.setValue(100);
              }}
              size="sm"
              variant="ghost"
            >
              Admin mode
            </Button>
          )}
          <UserButton />
        </div>
      }
    </>
  );
};
