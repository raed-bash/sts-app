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
  name: "Student Testing System",
  tagline: "Management Console",
  to: `/${homePaths.home}`,
};

export const sidebarCategories: SidebarCategory[] = [
  {
    title: "Menu",
    links: [
      {
        to: homePaths.home,
        label: "Home",
        Icon: Home,
      },
      {
        to: usersPaths.list,
        label: "Users",
        Icon: Users,
        roles: ["SUPER_ADMIN"],
      },
      {
        key: "bank",
        label: "Bank",
        Icon: LibraryBig,
        roles: ["SUPER_ADMIN"],
        pages: [
          {
            to: subjectsPaths.list,
            label: "Subjects",
            Icon: BookOpen,
          },
          {
            to: testsPaths.list,
            label: "Tests",
            Icon: FileText,
          },
          {
            to: questionsPaths.list,
            label: "Questions",
            Icon: CircleHelp,
          },
          {
            to: answersPaths.list,
            label: "Answers",
            Icon: CircleCheck,
          },
        ],
      },
      {
        to: testSessionsPaths.list,
        label: "Test Sessions",
        Icon: CalendarCheck,
        roles: ["SUPER_ADMIN", "STUDENT"],
      },
      {
        to: settingsPaths.settings,
        label: "Settings",
        Icon: Settings,
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];
