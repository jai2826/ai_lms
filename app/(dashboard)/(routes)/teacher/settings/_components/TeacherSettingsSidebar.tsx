'use client';

import { Key, Megaphone, Settings2, User } from 'lucide-react';
import { SidebarItem } from './SidebarItem';

const routes = [
  {
    icon: User,
    label: 'Teacher Profile',
    href: '/teacher/settings/profile',
    disabeld: false
    
  },
  {
    icon: Settings2,
    label: 'General',
    href: '/teacher/settings/general',
    disabeld: true
  },
  {
    icon: Megaphone,
    label: 'Marketing',
    href: '/teacher/settings/marketing',
    disabeld: true
  },
];

export const TeacherSettingsSidebar = () => {
  return (
    <div className="flex w-full lg:flex-col lg:w-72">
      {routes.map((route) => (
        <SidebarItem
        disabled={route.disabeld}
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
