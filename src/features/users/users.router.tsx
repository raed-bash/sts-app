import type { RouteObject } from "react-router";
import { usersPaths } from "./users.paths";
import { convert } from "@/app/app.router";
import type { QueryClient } from "@tanstack/react-query";

export const usersRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: usersPaths.list,
    lazy: () => import("./pages/UsersList").then(convert(queryClient)),
  },
];