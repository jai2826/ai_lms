"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart,
  BookOpen,
  List,
  ScrollText,
  SquareUser,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/app/(dashboard)/_components/logo";
import { cn } from "@/lib/utils";

const adminRoutes = [
  {
    icon: SquareUser,
    label: "Teacher",
    href: "/admin/teacher",
  },
  {
    icon: BookOpen,
    label: "Courses",
    href: "/admin/courses",
  },
  {
    icon: ScrollText,
    label: "Logs",
    href: "/admin/logs",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const isTeacherPage =
    pathname?.includes("/teacher") && !pathname?.includes("/admin");
  const routes = isTeacherPage ? teacherRoutes : adminRoutes;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={cn(
        "flex items-center justify-center py-6 border-b border-sidebar-border transition-all duration-200",
        isCollapsed ? "p-2" : "px-6"
      )}>
        {!isCollapsed ? (
          <Logo />
        ) : (
          <div className="font-bold text-xl text-primary animate-in fade-in-0 duration-200">
            A
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider animate-in fade-in-0 duration-200">
              {isTeacherPage ? "Teacher Mode" : "Admin Mode"}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {routes.map((route) => {
                const isActive =
                  pathname === route.href ||
                  (route.href !== "/" && pathname?.startsWith(route.href));

                return (
                  <SidebarMenuItem key={route.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={route.label}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200"
                    >
                      <Link href={route.href}>
                        <route.icon className={cn(
                          "h-5 w-5 shrink-0 text-muted-foreground transition-colors",
                          isActive && "text-primary"
                        )} />
                        {!isCollapsed && (
                          <span className="font-medium animate-in fade-in-0 duration-200">
                            {route.label}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
