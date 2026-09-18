import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import ProfileButton from "../profile/ProfileButton";
import GlobalSearch from "../search/GlobalSearch";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Button } from "@/shared/components/ui/button";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useThemeContext();

  return (
    <header className="mb-5 sticky top-0 pt-5 transition-all duration-300 z-99 after:content-[''] after:w-full after:backdrop-blur-md after:absolute after:left-0 after:top-0 after:h-full after:-z-10">
      <nav className="px-6 py-3 mx-6 flex items-center justify-between bg-(--surface) shadow-base z-100 rounded-md">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ms-2" />
          <GlobalSearch />
        </div>
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" onClick={toggleDarkMode}>
            {darkMode ? (
              <Sun size={22} className="stroke-white" />
            ) : (
              <Moon size={22} />
            )}
          </Button>
          <ProfileButton />
        </div>
      </nav>
    </header>
  );
}
