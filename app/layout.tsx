import { auth } from '@/auth';
import { ConfettiProvider } from '@/components/providers/confetti-provider';
import { ToastProvider } from '@/components/providers/toaster-provider';
import { Loader } from '@/components/top-loading-bar';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavigationEvents } from '@/components/navigation';
import { Suspense } from 'react';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CALP',
  description: 'Ai-powered Learning Mangement System',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <>
            <Loader />
            <ConfettiProvider />
            <ToastProvider />
            {children}
            <Suspense>
              <NavigationEvents />
            </Suspense>
          </>
        </body>
      </html>
    </SessionProvider>
  );
}
