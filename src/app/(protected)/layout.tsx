import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import AppSidebar from "./dashboard/_components/app-sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="m-2 w-full">
          <div className="mb-7 flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar p-2 px-4 shadow">
            {/* <SearchBar /> */}
            <div className="ml-auto">
              <UserButton />
            </div>
          </div>
          <div className="h-4">
            <div className="h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar p-4 shadow">
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default SidebarLayout;
