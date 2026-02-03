import { Outlet } from "react-router";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-(--background) text-(--text)">
      <Sidebar />
      <Navbar />
      <div className="flex h-full">
        <main className="flex-1 ps-[255px] pt-[62px]">
          <div className="p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
