import type { RouteObject } from "react-router";
import { userRoutesMeta } from "./users.routes-meta";
import { convert } from "@/app/app.router";
import type { QueryClient } from "@tanstack/react-query";

export const usersRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: userRoutesMeta.users.to,
    lazy: () => import("./pages/UsersList").then(convert(queryClient)),
  },
];
