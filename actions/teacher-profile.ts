'use server';

import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/currentUser';
import { db } from '@/lib/db';
import { ProfileSchema, TeacherProfileSchema } from '@/schemas';
import * as z from 'zod';
import { getTeacherByUserId } from '@/data/teacher';
export const TeacherProfile = async (
  values: z.infer<typeof TeacherProfileSchema>
) => {
  const user = await currentUser();
  if (!user || !user.id) {
    return { error: 'Unauthorized' };
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  const teacher = await getTeacherByUserId(user.id);

  if (!teacher) {
    return { error: 'No Teacher Found with this userId' };
  }

  if (values.email && values.email !== teacher.email) {
    const existingTeacher = await getTeacherByUserId(values.email);
    if (existingTeacher && existingTeacher.id !== teacher.id) {
      return { error: 'Email already in use' };
    }
  }

  await db.teacher.update({
    where: {
      id: teacher.id,
    },
    data: {
      ...values,
    },
  });
  return { success: 'Settings Updated' };
};
