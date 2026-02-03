import IconButton from "../buttons/IconButton";
import SunIcon from "src/assets/icons/sun.svg?react";
import CrescentIcon from "src/assets/icons/crescent.svg?react";
import { useThemeContext } from "src/contexts/ThemeContext";
import Profile from "../Profile";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useThemeContext();

  return (
    <nav className="w-screen px-6 py-3 flex items-center justify-between bg-(--background) fixed z-100 border-b-[#cacaca] dark:border-b-[#DFDFDF]/40 border-b">
      <h1 className="text-xl font-semibold text-(--text)">
        Student Testing System
      </h1>
      <div className="flex items-center gap-4">
        <IconButton onClick={toggleDarkMode}>
          {darkMode ? (
            <SunIcon
              width={22}
              height={22}
              className="fill-white stroke-white"
            />
          ) : (
            <CrescentIcon width={22} height={22} />
          )}
        </IconButton>
        <Profile />
      </div>
    </nav>
  );
}
