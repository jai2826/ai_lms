import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../lib/db";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      // Check if user has any linked account other than credential
      const oauthAccount = await db.account.findFirst({
        where: {
          userId: user.id,
          providerId: {
            not: "credential",
          },
        },
      });

      return {
        user: {
          ...user,
          isOAuth: !!oauthAccount,
        },
        session,
      };
    }),
  ],
});

