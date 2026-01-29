import { lazy } from "react";
import type { RouteObject } from "react-router";
import PageFallback from "src/components/PageFallback";

const Login = lazy(() => import("./pages/Login"));

export const authRouter: RouteObject[] = [
  {
    path: "login",
    element: (
      <PageFallback>
        <Login />
      </PageFallback>
    ),
  },
];
