'use server';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import { db } from '@/lib/db';

export const newVerification = async (token: string) => {
  const exhistingToken = await getVerificationTokenByToken(token);

  if (!exhistingToken) {
    return { error: 'Token does not exist' };
  }
  const hasExpired = new Date(exhistingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired' };
  }

  const existingUser = await getUserByEmail(exhistingToken.email);
  if (!existingUser) return { error: 'Email does not exist!' };

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: exhistingToken.email,
    },
  });

  const deleteToken = async () => {
    await db.verificationToken.delete({
      where: { id: exhistingToken.id },
    });
  };
  setTimeout(() => {
    deleteToken();
  }, 10000);
  return { success: 'Email verified' };
};
