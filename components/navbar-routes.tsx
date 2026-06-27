'use client';

import { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { SearchInput } from './search-input';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoader } from '@/hooks/useloader';
import { useTeacher } from '@/hooks/useTeacher';
import { UserButton } from '@/components/auth/user/user-button';

export const NavbarRoutes = () => {
  const user = useCurrentUser();
  const userId = user?.id;
  let teacher = useTeacher();

  if (teacher?.userId !== userId) teacher = undefined;

  const isAdmin = user?.role === 'ADMIN';
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
          <Suspense fallback={null}>
            <SearchInput />
          </Suspense>
        </div>
      )}
      {
        <div className="flex gap-x-2 ml-auto">
          {(isTeacherPage || isCoursePage) && (
            <Button
              onClick={() => {
                loader.setValue(40);
                router.push('/search');
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
