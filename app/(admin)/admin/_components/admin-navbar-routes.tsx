'use client';

import { UserButton } from '@/components/auth/user-button';
import { Button } from '@/components/ui/button';
import { allTeacherData } from '@/data/all-users-data';
import { useLoader } from '@/hooks/useloader';
import { Teacher } from '@prisma/client';
import { LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const AdminNavbarRoutes = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const session = useSession();
  const loader = useLoader();
  const router = useRouter();
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

          {teacher && (
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

          <UserButton />
        </div>
      }
    </>
  );
};
