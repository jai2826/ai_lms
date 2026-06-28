"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminNavbarRoutes } from "./admin-navbar-routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";

export function AdminNavbar() {
  const pathname = usePathname();

  // Generate breadcrumb items based on current path
  const getBreadcrumbs = () => {
    const paths = pathname ? pathname.split("/").filter(Boolean) : [];
    if (paths.length === 0) {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage>Admin</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin/teacher">Admin</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((path, index) => {
          // Skip "admin" path to avoid redundant breadcrumbs
          if (path === "admin") return null;

          const isLast = index === paths.length - 1;
          const href = "/" + paths.slice(0, index + 1).join("/");
          const label = path.charAt(0).toUpperCase() + path.slice(1);
          
          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-foreground">{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="capitalize">{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40 transition-all duration-200">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-muted" />
        {/* <Separator orientation="vertical" className="h-4 mx-2" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {getBreadcrumbs()}
          </BreadcrumbList>
        </Breadcrumb> */}
      </div>
      <div className="flex items-center gap-4 flex-1 justify-end">
        <AdminNavbarRoutes />
      </div>
    </header>
  );
}
