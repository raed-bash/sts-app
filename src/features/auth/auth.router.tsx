import { convert } from "@/app/app.router";
import AuthRoute from "@/components/AuthRoute";
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
        path: "login",
        index: true,
        lazy: () => import("./pages/Login").then(convert(queryClient)),
      },
      {
        path: "sign-up",
        lazy: () => import("./pages/SignUp").then(convert(queryClient)),
      },
    ],
  },
];
