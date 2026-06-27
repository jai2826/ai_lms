import { currentUser } from './currentUser';
import { getTeacherByUserId } from '@/data/teacher';

export const currentTeacher = async () => {
  const user = await currentUser();
  if (!user?.id) return;
  const teacher = await getTeacherByUserId(user.id);
  return teacher;
};
