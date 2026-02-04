import { Outlet } from "react-router";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-(--background) text-(--text)">
      <Navbar />
      <Sidebar />
      <div className="flex h-full">
        <main className="flex-1 ps-[280px]">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
