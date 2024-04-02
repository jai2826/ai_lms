import { db } from '@/lib/db';

export const getTeacherByUserId = async (userId: string) => {
  try {
    const teacher = await db.teacher.findUnique({
      where: {
        userId,
      },
    });

    return teacher;
  } catch {
    return null;
  }
};
