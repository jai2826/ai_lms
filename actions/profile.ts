'use server';

import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/currentUser';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
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

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use' };
    }
  }

  let hashedPassword = undefined;
  if (values.password) {
    const ctx = await auth.$context;
    hashedPassword = await ctx.password.hash(values.password);
  }

  if (hashedPassword) {
    // Check if credentials account exists
    const credentialsAccount = await db.account.findFirst({
      where: {
        userId: dbUser.id,
        providerId: 'credential',
      },
    });

    if (credentialsAccount) {
      await db.account.update({
        where: {
          id: credentialsAccount.id,
        },
        data: {
          password: hashedPassword,
        },
      });
    } else {
      // Create credential account record
      await db.account.create({
        data: {
          userId: dbUser.id,
          providerId: 'credential',
          accountId: dbUser.id, // Better Auth default
          password: hashedPassword,
        },
      });
    }
  }

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      name: values.name,
      email: values.email,
      image: values.image,
      role: values.role,
    },
  });

  return { success: 'Settings Updated' };
};
