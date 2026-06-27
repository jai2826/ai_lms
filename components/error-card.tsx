import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md border-none mx-auto mt-20">
      <CardHeader className="flex flex-col items-center justify-center gap-y-2">
        <h1 className="text-3xl font-semibold">⚠️ Auth</h1>
        <p className="text-muted-foreground text-sm">Oops! Something went wrong!</p>
      </CardHeader>
      <CardContent>
        <div className="w-full flex items-center justify-center">
          <FaExclamationTriangle className="text-destructive h-10 w-10" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link 
          href="/auth/login" 
          className={cn(buttonVariants({ variant: 'link' }), 'w-full')}
        >
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
};
