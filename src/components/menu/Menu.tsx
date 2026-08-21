import { useRef, useState, type ReactNode } from "react";
// import Tooltip from "../tooltip/Tooltip";
import MoreIcon from "src/assets/icons/more.svg?react";
import useFocusout from "src/hooks/useFocusout";
import IconButton, { type IconButtonProps } from "../buttons/IconButton";
import { cn } from "src/utils/cn";
import Animation from "../Animation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type MenuProps = {
  tooltipTitle?: string;
  children?: ReactNode;
  iconButtonProps?: IconButtonProps;
};

function Menu({ tooltipTitle, children, iconButtonProps }: MenuProps) {
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  const handleOpenMenu = () => {
    setOpenMenu((prevOpenMenu) => !prevOpenMenu);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  useFocusout(menuRef, handleCloseMenu);

  return (
    <div className="relative" ref={menuRef}>
      <Tooltip>
        <TooltipTrigger
          render={
            <IconButton
              {...iconButtonProps}
              onClick={(e) => {
                handleOpenMenu();

                iconButtonProps?.onClick?.(e);
              }}
            >
              <MoreIcon className="rotate-90 fill-(--primary) dark:fill-(--text) w-5 h-5 " />
            </IconButton>
          }
        />

        {!openMenu && tooltipTitle && (
          <TooltipContent>{tooltipTitle}</TooltipContent>
        )}
      </Tooltip>
      <Animation
        className={cn(
          `duration-75 absolute rtl:left-0 ltr:right-0 py-2 max-h-96 px-3 overflow-auto
           min-w-max bg-(--surface) rounded-md z-10000000 flex flex-col gap-3 shadow-base `,
          "shadow-(0_0_10px_0_#00000020)",
        )}
        isOpen={openMenu}
      >
        {children}
      </Animation>
    </div>
  );
}

export default Menu;
