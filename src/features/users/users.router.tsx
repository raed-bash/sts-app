import { lazy } from "react";
import type { RouteObject } from "react-router";
import { userRoutesMeta } from "./users.routes-meta";
import PageFallback from "@/shared/components/custom/PageFallback";

const UsersList = lazy(() => import("./pages/UsersList"));

export const usersRouter: RouteObject[] = [
  {
    path: userRoutesMeta.users.to,
    element: (
      <PageFallback>
        <UsersList />
      </PageFallback>
    ),
  },
];
