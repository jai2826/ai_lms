'use client';
import { useLoader } from '@/hooks/useloader';
import LoadingBar from 'react-top-loading-bar';

export const Loader = () => {
  const loader = useLoader();
  if (!loader.isLoading) return null;

  return (
    <LoadingBar
      waitingTime={1000}
      transitionTime={400}
      loaderSpeed={500}
      color="#f11946"
      progress={loader.value}
      onLoaderFinished={() => loader.setIsloading(false)}
    />
  );
};
