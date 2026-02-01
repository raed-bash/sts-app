import { useLocation } from "react-router";
import AppLink from "../AppLink";
import HomeIcon from "src/assets/icons/home.svg?react";
import UsersIcon from "src/assets/icons/users.svg?react";
import SettingsIcon from "src/assets/icons/settings.svg?react";
import IconButton from "../buttons/IconButton";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-(--background) text-(--text) py-4 h-full pt-[73px] fixed border-r-[#cacaca] dark:border-r-[#DFDFDF]/40 border-r">
      <div className="flex flex-col px-2 gap-2">
        {links.map((link) => (
          <AppLink
            key={link.to}
            to={link.to}
            className="inline-block no-underline"
          >
            <IconButton
              className="w-full justify-start rounded-lg fill-(--text) aria-selected:bg-(--primary) aria-selected:fill-white aria-selected:text-white"
              aria-selected={location.pathname.startsWith(`/${link.to}`)}
            >
              {link.Icon && <span className="me-2">{link.Icon}</span>}

              {link.label}
            </IconButton>
          </AppLink>
        ))}
      </div>
    </div>
  );
}

const links = [
  {
    to: "home",
    label: "Home",
    Icon: <HomeIcon />,
  },
  {
    to: "users",
    label: "Users",
    Icon: <UsersIcon />,
  },
  {
    to: "settings",
    label: "Settings",
    Icon: <SettingsIcon />,
  },
];
