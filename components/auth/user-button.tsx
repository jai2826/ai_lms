'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogoutButton } from './logout-button';
import { useLoader } from '@/hooks/useloader';

export const UserButton = () => {
  const user = useCurrentUser();
  const loader = useLoader();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage alt="user" src={user?.image || ''} />
          <AvatarFallback className="bg-indigo-300">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 " align="end">
        <Link
          onClick={() => {
            loader.setValue(40);
          }}
          href={'/user'}
        >
          <DropdownMenuItem>
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
        </Link>
        <LogoutButton>
          <DropdownMenuItem>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
