import React, { memo, useCallback, useRef, useState } from "react";
import Tooltip from "../Tooltip";
import { ReactComponent as MoreIcon } from "src/assets/icons/more.svg";
import useFocusout from "src/hooks/useFocusout";
import IconButton from "../buttons/IconButton";

function Menu({ children }) {
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  const handleOpenMenu = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  useFocusout(menuRef, handleCloseMenu);

  return (
    <div className="relative">
      <Tooltip title="الأعمدة">
        <IconButton className="max-w-min relative " onClick={handleOpenMenu}>
          <MoreIcon className="rotate-90 fill-primary-main " />
        </IconButton>
      </Tooltip>
      <div
        className={`${
          openMenu ? "opacity-100 shadow-md " : "opacity-0 hidden "
        } duration-75 absolute left-0 py-2 max-h-96 px-3 overflow-auto min-w-max bg-white rounded-md z-[10000] flex flex-col gap-3  `}
        ref={menuRef}
      >
        {children}
      </div>
    </div>
  );
}

export default memo(Menu);
