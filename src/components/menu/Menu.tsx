import { useRef, useState, type ReactNode } from "react";
import Tooltip from "../tooltip/Tooltip";
import MoreIcon from "src/assets/icons/more.svg?react";
import useFocusout from "src/hooks/useFocusout";
import IconButton from "../buttons/IconButton";
import { cn } from "src/utils/cn";
import Animation from "../Animation";

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
      <Tooltip title="show\hide columns">
        <IconButton onClick={handleOpenMenu}>
          <MoreIcon className="rotate-90 fill-(--primary) " />
        </IconButton>
      </Tooltip>
      <Animation
        className={cn(
          `duration-75 absolute rtl:left-0 ltr:right-0 py-2 max-h-96 px-3 overflow-auto
           min-w-max bg-(--surface) rounded-md z-10000 flex flex-col gap-3 shadow-base `,
        )}
        ref={menuRef}
        isOpen={openMenu}
      >
        {children}
      </Animation>
    </div>
  );
}

export default Menu;
