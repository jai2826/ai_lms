import {
  SidebarProvider
} from "@/components/ui/sidebar";

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <SidebarProvider>
        Hello Harrry
        
        {/* <SidebarTrigger className="mr-2"/> */}
      </SidebarProvider>
    </div>
  );
};
