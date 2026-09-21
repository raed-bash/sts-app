import type { RouteObject } from "react-router";
import { testSessionsPaths } from "./test-sessions.paths";
import { convert } from "@/app/app.router";
import type { QueryClient } from "@tanstack/react-query";

export const testSessionsRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: testSessionsPaths.list,
    lazy: () => import("./pages/TestSessionsList").then(convert(queryClient)),
  },
  {
    path: testSessionsPaths.results,
    lazy: () => import("./pages/TestSessionResults").then(convert(queryClient)),
  },
  {
    path: testSessionsPaths.exam,
    lazy: () => import("./pages/TakeExam").then(convert(queryClient)),
  },
];
