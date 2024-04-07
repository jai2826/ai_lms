import { Resend } from 'resend';
import nodemailer from 'nodemailer';
const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendPasswordResetEmail = async (email: string, token: string) => {
//   const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

//   await resend.emails.send({
//     from: 'onboarding@resend.dev',
//     to: email,
//     subject: 'Reset your password',
//     html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
//   });
// };

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

//   await resend.emails.send({
//     from: 'onboarding@resend.dev',
//     to: email,
//     subject: 'Confirm your email',
//     html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
//   });
// };

// export const sendPasswordResetEmail = async (email: string, token: string) => {
//   const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

//   await resend.emails.send({
//     from: 'onboarding@resend.dev',
//     to: email,
//     subject: 'Reset your password',
//     html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
//   });
// };

export async function sendVerificationEmail({
  to,
  name,
  subject,
  token,
}: {
  to: string;
  name: string;
  subject: string;
  token: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const testResult = await transport.verify();
    console.log(testResult);
  } catch (error) {
    console.log(error);
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
    });
    console.log(sendResult);
  } catch (error) {
    console.log(error);
  }
}
export async function sendPasswordResetEmail({
  to,
  name,
  subject,
  token,
}: {
  to: string;
  name: string;
  subject: string;
  token: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password?token=${token}`;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const testResult = await transport.verify();
    console.log(testResult);
  } catch (error) {
    console.log(error);
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
    console.log(sendResult);
  } catch (error) {
    console.log(error);
  }
}
