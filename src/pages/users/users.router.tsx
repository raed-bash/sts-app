import { lazy } from "react";
import type { RouteObject } from "react-router";
import PageFallback from "src/components/PageFallback";

const UsersList = lazy(() => import("./pages/UsersList"));

export const usersRouter: RouteObject[] = [
  {
    path: "users",
    element: (
      <PageFallback>
        <UsersList />
      </PageFallback>
    ),
  },
];
