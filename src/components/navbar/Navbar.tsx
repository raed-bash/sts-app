import IconButton from "../buttons/IconButton";
import SunIcon from "src/assets/icons/sun.svg?react";
import CrescentIcon from "src/assets/icons/crescent.svg?react";
import { useThemeContext } from "src/contexts/ThemeContext";
import ProfileButton from "../profile/ProfileButton";
import InputPlus from "../inputs/InputPlus";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useThemeContext();

  return (
    <header className="ms-[280px] mb-5 sticky top-0 pt-5 transition-all duration-300 z-99 after:content-[''] after:w-full after:backdrop-blur-md after:absolute after:left-0 after:top-0 after:h-full after:-z-10">
      <nav className="px-6 py-3 mx-6 flex items-center justify-between bg-(--surface) shadow-base z-100 rounded-md">
        <InputPlus
          type="text"
          title=""
          oneline
          className=" placeholder:text-xs "
          placeholder="Search..."
        />
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
          <ProfileButton />
        </div>
      </nav>
    </header>
  );
}
