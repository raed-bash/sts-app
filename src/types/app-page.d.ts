import type { ReactNode } from "react";

export type AppPageNestedPages = {
  to?: undefined;

  pages: Omit<AppPageSidebar, "pages">[];
};

export type AppPageSidebar = (
  | AppPageNestedPages
  | {
      to: string;

      pages?: undefined;
    }
) & {
  sidebar: true;

  Icon: ReactNode;

  key: string;

  label: string;
};

export type AppPageNormal = {
  sidebar?: undefined;

  to: string;

  Icon?: ReactNode;

  label: string;
};

export type AppPage = AppPageNormal | AppPageSidebar;

export type AppPages<Name = string> = Record<Name, AppPage>;
