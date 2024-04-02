import { auth } from '@/auth';
import { getTeacherByUserId } from '@/data/teacher';

export const currentTeacher = async () => {
  const session = await auth();
  if (!session?.user.id) return;
  const teacher = await getTeacherByUserId(session?.user.id);
  return teacher;
};
