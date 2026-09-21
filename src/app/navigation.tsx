import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarCheck,
  CircleCheck,
  CircleHelp,
  FileText,
  Home,
  LibraryBig,
  Settings,
  Users,
} from "lucide-react";
import type { UserRole } from "@/constants/user-role";
import { homePaths } from "@/features/home/home.paths";
import { usersPaths } from "@/features/users/users.paths";
import { subjectsPaths } from "@/features/subjects/subjects.paths";
import { testsPaths } from "@/features/tests/tests.paths";
import { questionsPaths } from "@/features/questions/questions.paths";
import { answersPaths } from "@/features/answers/answers.paths";
import { testSessionsPaths } from "@/features/test-sessions/test-sessions.paths";
import { settingsPaths } from "@/features/settings/settings.paths";

export type SidebarLink = {
  to: string;

  label: string;

  Icon: LucideIcon;

  roles?: UserRole[];
};

export type SidebarSection = {
  key: string;

  label: string;

  Icon: LucideIcon;

  roles?: UserRole[];

  pages: SidebarLink[];
};

export type SidebarCategory = {
  title: string;

  links: (SidebarLink | SidebarSection)[];
};

export const sidebarBrand = {
  name: "nav:brand.name",
  tagline: "nav:brand.tagline",
  to: `/${homePaths.home}`,
};

export const sidebarCategories: SidebarCategory[] = [
  {
    title: "nav:menu",
    links: [
      {
        to: homePaths.home,
        label: "nav:home",
        Icon: Home,
      },
      {
        to: usersPaths.list,
        label: "entities.users",
        Icon: Users,
        roles: ["SUPER_ADMIN"],
      },
      {
        key: "bank",
        label: "nav:bank",
        Icon: LibraryBig,
        roles: ["SUPER_ADMIN"],
        pages: [
          {
            to: subjectsPaths.list,
            label: "entities.subjects",
            Icon: BookOpen,
          },
          {
            to: testsPaths.list,
            label: "entities.tests",
            Icon: FileText,
          },
          {
            to: questionsPaths.list,
            label: "entities.questions",
            Icon: CircleHelp,
          },
          {
            to: answersPaths.list,
            label: "entities.answers",
            Icon: CircleCheck,
          },
        ],
      },
      {
        to: testSessionsPaths.list,
        label: "entities.testSessions",
        Icon: CalendarCheck,
        roles: ["SUPER_ADMIN", "STUDENT"],
      },
      {
        to: settingsPaths.settings,
        label: "entities.settings",
        Icon: Settings,
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];
