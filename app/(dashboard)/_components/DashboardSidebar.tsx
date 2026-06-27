"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./logo";
import { SidebarRoutes } from "./sidebar-routes";
import {
  BarChartIcon,
  CompassIcon,
  Layout,
  LayoutIcon,
  ListIcon,
  SettingsIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: LayoutIcon,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: CompassIcon,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: ListIcon,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChartIcon,
    label: "Analytics",
    href: "/teacher/analytics",
  },
  {
    icon: SettingsIcon,
    label: "Settings",
    href: "/teacher/settings",
  },
];

export const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage
    ? teacherRoutes
    : guestRoutes;

  return (
    <Sidebar {...props}>
      <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm ">
        <div className="p-6 flex items-center justify-center">
          <Logo />
        </div>
        <SidebarContent>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === route.href}>
                  <a href={route.href}>
                    <route.icon className="h-4 w-4" />
                    <span>{route.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </div>
    </Sidebar>
  );
};
