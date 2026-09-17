import type { RouteObject } from "react-router";
import { settingsPaths } from "./settings.paths";
import { convert } from "@/app/app.router";
import type { QueryClient } from "@tanstack/react-query";

export const settingsRouter = (queryClient: QueryClient): RouteObject[] => [
  {
    path: settingsPaths.settings,
    lazy: () => import("./pages/SettingsPage").then(convert(queryClient)),
  },
];