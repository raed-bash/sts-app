import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="min-w-0 bg-(--background) text-(--text)">
        <Navbar />
        <div className="min-w-0 flex-1 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
