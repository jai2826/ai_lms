'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoader } from '@/hooks/useloader';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loader = useLoader();

  useEffect(() => {
    loader.setValue(60);
    const url = `${pathname}?${searchParams}`;
    loader.setValue(80);
    // console.log(url);
    loader.setValue(100);
  }, [pathname, searchParams]);

  return null;
}
