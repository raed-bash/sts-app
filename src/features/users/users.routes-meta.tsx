import type { AppRoutesMetas } from "@/types/app.routes-meta";
import UsersIcon from "@/assets/icons/users.svg?react";

export const userRoutesMeta = {
  users: {
    label: "Users",
    to: "users",
    sidebar: true,
    Icon: UsersIcon,
  },
} as const satisfies AppRoutesMetas;
