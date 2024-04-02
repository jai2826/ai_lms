'use client';

import {
  BarChart,
  BookOpen,
  Compass,
  Layout,
  List,
  ScrollText,
  SquareUser,
} from 'lucide-react';
import { AdminSidebarItem } from './admin-sidebar-item';
import { usePathname } from 'next/navigation';

const adminRoutes = [
  {
    icon: SquareUser,
    label: 'Teacher',
    href: '/admin/teacher',
  },
  {
    icon: ScrollText,
    label: 'Logs',
    href: '/admin/logs',
  },
  {
    icon: BookOpen,
    label: 'Courses',
    href: '/admin/courses',
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: 'Courses',
    href: '/teacher/courses',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    href: '/teacher/analytics',
  },
];

export const AdminSidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage =
    pathname?.includes('/teacher') && !pathname?.includes('/admin');
  const routes = isTeacherPage ? teacherRoutes : adminRoutes;

  return (
    <div className="felx flex-col w-full">
      {routes.map((route) => (
        <AdminSidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
