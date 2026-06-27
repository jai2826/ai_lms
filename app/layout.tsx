import { ConfettiProvider } from '@/components/providers/confetti-provider';
import { ToastProvider } from '@/components/providers/toaster-provider';
import { Loader } from '@/components/top-loading-bar';
import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { NavigationEvents } from '@/components/navigation';
import { Suspense } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cn } from "@/lib/utils";
import { Providers } from '@/components/providers/provider';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  return (
    <Providers>
      <html lang="en" className={cn("font-sans", geist.variable)}>
        <body className={inter.className}>
          <>
            <Loader />
            <ConfettiProvider />
            <ToastProvider />
            {children}
            <SpeedInsights />
            <Suspense>
              <NavigationEvents />
            </Suspense>
          </>
        </body>
      </html>
    </Providers>
  );
}
