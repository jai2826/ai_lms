import NextAuth, { type DefaultSession } from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';
import { getUserById } from './data/user';
import { Teacher, UserRole } from '@prisma/client';
import { getAccountByUserId } from './data/account';
import { getTeacherByUserId } from './data/teacher';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      const exhistingUser = await getUserById(user.id!);

      if (!exhistingUser?.emailVerified) return false;

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.teacher) {
        session.teacher = token.teacher as Teacher;
      }
      
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
      }

      // if (session.teacher) {
      //   // @ts-ignore
      //   session.teacher.name = token.teacher.name;
      //   // @ts-ignore
      //   session.teacher.email = token.teacher.email;
      //   // @ts-ignore
      //   session.teacher.phone = token.teacher.phone;
      //   // @ts-ignore
      //   session.teacher.image = token.teacher.image;
      // }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      token.role = existingUser.role;

      const teacher = await getTeacherByUserId(token.sub);
      token.teacher = teacher;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
