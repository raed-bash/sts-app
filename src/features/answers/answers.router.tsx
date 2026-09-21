import type { RouteObject } from "react-router";
import { answersPaths } from "./answers.paths";
import { convert } from "@/app/app.router";
import type { QueryClient } from "@tanstack/react-query";

export const answersRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: answersPaths.list,
    lazy: () => import("./pages/AnswersList").then(convert(queryClient)),
  },
];
