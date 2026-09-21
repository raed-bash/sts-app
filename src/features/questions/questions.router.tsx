import type { RouteObject } from "react-router";
import { questionsPaths } from "./questions.paths";
import { convert } from "@/app/app.router";
import type { QueryClient } from "@tanstack/react-query";

export const questionsRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: questionsPaths.list,
    lazy: () => import("./pages/QuestionsList").then(convert(queryClient)),
  },
  {
    path: questionsPaths.detail,
    lazy: () => import("./pages/QuestionDetail").then(convert(queryClient)),
  },
];
