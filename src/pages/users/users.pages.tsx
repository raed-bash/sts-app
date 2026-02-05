import type { AppPages } from "src/types/app-page";
import UsersIcon from "src/assets/icons/users.svg?react";

export const UserPages = {
  users: {
    key: "users",
    label: "Users",
    to: "users",
    sidebar: true,
    Icon: <UsersIcon />,
  },
} as const satisfies AppPages;
