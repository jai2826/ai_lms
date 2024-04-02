'use server';
import { db } from '@/lib/db';

export const allUsersData = async () => {
  try {
    const usersList = await db.user.findMany();
    return usersList;
  } catch {
    return null;
  }
};
export const allTeacherData = async () => {
  try {
    const teacherList = await db.teacher.findMany();
    return teacherList;
  } catch {
    return null;
  }
};
