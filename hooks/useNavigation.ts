import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

interface NavigationEvents {
  routeChanged?: ({
    pathname,
    searchParams,
  }: {
    pathname: string | null;
    searchParams: URLSearchParams | null;
  }) => void;
}

export const useNavigation = ({ on }: { on?: NavigationEvents }) => {
  const pathname = usePathname();
  const prevPathname = usePrevious(pathname);

  const searchParams = useSearchParams();
  const prevSearchParams = usePrevious(searchParams);

  const { routeChanged } = on || {};
  const [route, setRoute] = useState({ pathname, searchParams });

  useEffect(() => {
    if (
      searchParams?.toString() !== prevSearchParams?.toString() ||
      pathname !== prevPathname
    ) {
      setRoute({ pathname, searchParams });
      routeChanged?.({ pathname, searchParams });
    }
  }, [pathname, prevPathname, prevSearchParams, routeChanged, searchParams]);

  return { route };
};
