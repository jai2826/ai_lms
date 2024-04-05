'use client';

import { useLoader } from '@/hooks/useloader';
import { signOut } from 'next-auth/react';

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const loader = useLoader();
  const onClick = () => {
    loader.setValue(40);
    signOut();
    loader.setValue(40);
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
