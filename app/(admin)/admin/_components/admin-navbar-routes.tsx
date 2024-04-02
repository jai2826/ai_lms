'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from '@/components/auth/user-button';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { allTeacherData } from '@/data/all-users-data';
import { Teacher } from '@prisma/client';

export const AdminNavbarRoutes = () => {
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

  return (
    <>
      {
        <div className="flex gap-x-2 ml-auto">
          <Link href={'/'}>
            <Button size={'sm'} variant={'ghost'}>
              <LogOut className="h-4 w-4" />
              Exit
            </Button>
          </Link>
          {teacher && (
            <Link href={'/teacher/courses'}>
              <Button size="sm" variant="ghost">
                Teacher mode
              </Button>
            </Link>
          )}

          <UserButton />
        </div>
      }
    </>
  );
};
