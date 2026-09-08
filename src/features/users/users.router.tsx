import { lazy } from "react";
import type { RouteObject } from "react-router";
import { UserPages } from "./users.pages";
import PageFallback from "@/shared/components/custom/PageFallback";

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
