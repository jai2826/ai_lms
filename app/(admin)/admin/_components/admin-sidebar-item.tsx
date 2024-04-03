'use client';

import { useLoader } from '@/hooks/useloader';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const AdminSidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const loader = useLoader();

  const isActive =
    (pathname === '/admin' && href === '/admin/') ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    loader.setValue(25);
    router.push(href);
    loader.setValue(50);
    router.refresh();
    loader.setValue(100);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 w-full ',
        isActive &&
          'text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700'
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn('text-slate-500', isActive && 'text-sky-700')}
        />
        {label}
      </div>
      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-sky-700 h-14 transition-all',
          isActive && 'opacity-100'
        )}
      />
    </button>
  );
};
