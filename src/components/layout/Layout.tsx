import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import ActiveExamRedirect from "@/features/test-sessions/components/ActiveExamRedirect";

export default function Layout() {
  return (
    <SidebarProvider>
      <ActiveExamRedirect />
      <Sidebar />
      <SidebarInset className="min-w-0 bg-background text-foreground">
        <Navbar />
        <div className="min-w-0 flex-1 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
