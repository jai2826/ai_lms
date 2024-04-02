import { UserRole, Teacher } from '@prisma/client';
import * as z from 'zod';

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum of 6 characters required',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});
export const ProfileSchema = z.object({
  name: z.optional(
    z.string().min(1, {
      message: 'Name cannot be empty',
    })
  ),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(
    z.string().min(1, {
      message: 'Email cannot be empty',
    })
  ),
  image: z.optional(z.string()),
  password: z.optional(z.string().min(6)),
});
export const TeacherProfileSchema = z.object({
  name: z.optional(
    z.string().min(1, {
      message: 'Name cannot be empty',
    })
  ),
  email: z.optional(
    z.string().min(1, {
      message: 'Email cannot be empty',
    })
  ),
  phone: z.optional(z.string().length(10)),
  image: z.optional(z.string()),
});

