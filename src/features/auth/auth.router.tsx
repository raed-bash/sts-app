import { convert } from "@/app/app.router";
import AuthRoute from "@/components/AuthRoute";
import { authPaths } from "./auth.paths";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, type RouteObject } from "react-router";

export const authRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: "",
    element: (
      <AuthRoute>
        <Outlet />
      </AuthRoute>
    ),
    children: [
      {
        path: authPaths.login,
        lazy: () => import("./pages/Login").then(convert(queryClient)),
      },
      {
        path: authPaths.signUp,
        lazy: () => import("./pages/SignUp").then(convert(queryClient)),
      },
    ],
  },
];