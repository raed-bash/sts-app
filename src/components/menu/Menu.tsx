import { useRef, useState, type ReactNode } from "react";
import Tooltip from "../Tooltip";
import MoreIcon from "src/assets/icons/more.svg?react";
import useFocusout from "src/hooks/useFocusout";
import IconButton from "../buttons/IconButton";
import { cn } from "src/utils/cn";

export type MenuProps = { children: ReactNode };

function Menu({ children }: MenuProps) {
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  useFocusout(menuRef, handleCloseMenu);

  return (
    <div className="relative">
      <Tooltip title="الأعمدة">
        <IconButton className="max-w-min relative " onClick={handleOpenMenu}>
          <MoreIcon className="rotate-90 fill-primary-main " />
        </IconButton>
      </Tooltip>
      <div
        className={cn(
          openMenu ? "opacity-100 shadow-md " : "opacity-0 hidden ",
          `duration-75 absolute left-0 py-2 max-h-96 px-3 overflow-auto
           min-w-max bg-white rounded-md z-10000 flex flex-col gap-3`
        )}
        ref={menuRef}
      >
        {children}
      </div>
    </div>
  );
}

export default Menu;
