import { auth, useUser } from '@clerk/nextjs';
import AdminNavbar from './_components/admin-navbar';
import { AdminSidebar } from './_components/admin-sidebar';
import { redirect, usePathname } from 'next/navigation';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 inset-y-0 w-full z-50">
        <AdminNavbar />
      </div>
      <div className="hidden md:flex h-full flex-col w-56 fixed inset-y-0 z-50">
        <AdminSidebar />
      </div>
      <main className="md:pl-56 h-full ">{children}</main>
    </div>
  );
};

export default AdminLayout;
