import type { RouteObject } from "react-router";
import { testsPaths } from "./tests.paths";
import { convert } from "@/app/app.router";
import type { QueryClient } from "@tanstack/react-query";

export const testsRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: testsPaths.list,
    lazy: () => import("./pages/TestsList").then(convert(queryClient)),
  },
  {
    path: testsPaths.detail,
    lazy: () => import("./pages/TestDetail").then(convert(queryClient)),
  },
];