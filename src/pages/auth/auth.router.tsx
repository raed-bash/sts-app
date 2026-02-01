import { lazy } from "react";
import type { RouteObject } from "react-router";
import AuthRoute from "src/components/AuthRoute";
import PageFallback from "src/components/PageFallback";

const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));

export const authRouter: RouteObject[] = [
  {
    path: "login",
    element: (
      <AuthRoute>
        <PageFallback>
          <Login />
        </PageFallback>
      </AuthRoute>
    ),
  },
  {
    path: "sign-up",
    element: (
      <AuthRoute>
        <PageFallback>
          <SignUp />
        </PageFallback>
      </AuthRoute>
    ),
  },
];
