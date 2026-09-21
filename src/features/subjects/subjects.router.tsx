import type { RouteObject } from "react-router";
import { subjectsPaths } from "./subjects.paths";
import { convert } from "@/app/app.router";
import type { QueryClient } from "@tanstack/react-query";

export const subjectsRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: subjectsPaths.list,
    lazy: () => import("./pages/SubjectsList").then(convert(queryClient)),
  },
  {
    path: subjectsPaths.detail,
    lazy: () => import("./pages/SubjectDetail").then(convert(queryClient)),
  },
];
