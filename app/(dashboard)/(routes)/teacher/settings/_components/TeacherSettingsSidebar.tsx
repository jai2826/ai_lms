'use client';

import { Key, Megaphone, Settings2, User } from 'lucide-react';
import { SidebarItem } from './SidebarItem';

const routes = [
  {
    icon: Settings2,
    label: 'General',
    href: '/teacher/settings/general',
  },
  {
    icon: User,
    label: 'Teacher Profile',
    href: '/teacher/settings/profile',
  },
  {
    icon: Megaphone,
    label: 'Marketing',
    href: '/teacher/settings/marketing',
  },
];

export const TeacherSettingsSidebar = () => {
  return (
    <div className="flex w-full lg:flex-col lg:w-72">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
