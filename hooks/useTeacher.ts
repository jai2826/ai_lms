import { getTeacherByUserId } from '@/data/teacher';
import { useSession } from 'next-auth/react';
export const useTeacher = () => {
  const session = useSession();
  const teacher = session.data?.teacher;

  return teacher;
};
