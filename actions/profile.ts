'use server';

import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/currentUser';
import { db } from '@/lib/db';
import { ProfileSchema } from '@/schemas';
import * as z from 'zod';
export const Profile = async (values: z.infer<typeof ProfileSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }
 
  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  // if (user.isOAuth) {
  //   values.email = undefined;
  //   values.password = undefined;
  // }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use' };
    }
  }

  let hashedPassword = undefined;
  if (values.password) {
    hashedPassword = await bcrypt.hash(values.password!, 10);
  }

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values,
      password: hashedPassword,
    },
  });
  return { success: 'Settings Updated' };
};
