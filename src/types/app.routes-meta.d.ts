import React from "react";

export type AppRoutesMetaNestedRoutes = {
  to?: undefined;

  pages: (Omit<AppRoutesMetaSidebar, "pages"> & { to: string })[];

  key: string;
};

export type AppRoutesMetaSidebar = (
  | AppRoutesMetaNestedRoutes
  | {
      to: string;

      pages?: undefined;

      key?: unknown;
    }
) & {
  sidebar: true;

  Icon: React.FC;

  label: string;
};

export type AppRoutesMetaNormal = {
  sidebar?: false | undefined;

  to: string;

  Icon?: React.FC;

  label: string;
};

export type AppRoutesMeta = AppRoutesMetaNormal | AppRoutesMetaSidebar;

export type AppRoutesMetas<Name extends string | number = string> = Record<
  Name,
  AppRoutesMeta
>;
