import { MainSidebar } from "./_components/DashboardSidebar";
import { Navbar } from "./_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-20 md:pl-56 inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full flex-col w-56 fixed inset-y-0 z-50">
        <MainSidebar />
      </div>
      <main className="md:pl-56 ">{children}</main>
    </div>
  );
};

export default DashboardLayout;
