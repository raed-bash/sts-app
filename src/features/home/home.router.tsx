import type { RouteObject } from "react-router";
import { homePaths } from "./home.paths";
import { convert } from "@/app/app.router";
import type { QueryClient } from "@tanstack/react-query";

export const homeRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: homePaths.home,
    lazy: () => import("./pages/Home").then(convert(queryClient)),
  },
];
