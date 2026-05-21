import { lazy } from "react";
import type { RouteObject } from "react-router";
import PageFallback from "src/components/PageFallback";
import { UserPages } from "./users.pages";

const UsersList = lazy(() => import("./pages/UsersList"));

export const usersRouter: RouteObject[] = [
  {
    path: UserPages.users.to,
    element: (
      <PageFallback>
        <UsersList />
      </PageFallback>
    ),
  },
];
