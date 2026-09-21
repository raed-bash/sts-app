import "i18next";

import type { ParseKeys, TFunction } from "i18next";

import commonEn from "./i18n/locales/en/common.json";
import navEn from "./i18n/locales/en/nav.json";
import authEn from "./i18n/locales/en/auth.json";
import homeEn from "./i18n/locales/en/home.json";
import subjectsEn from "./i18n/locales/en/subjects.json";
import testsEn from "./i18n/locales/en/tests.json";
import questionsEn from "./i18n/locales/en/questions.json";
import answersEn from "./i18n/locales/en/answers.json";
import usersEn from "./i18n/locales/en/users.json";
import testSessionsEn from "./i18n/locales/en/testSessions.json";
import settingsEn from "./i18n/locales/en/settings.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof commonEn;
      nav: typeof navEn;
      auth: typeof authEn;
      home: typeof homeEn;
      subjects: typeof subjectsEn;
      tests: typeof testsEn;
      questions: typeof questionsEn;
      answers: typeof answersEn;
      users: typeof usersEn;
      testSessions: typeof testSessionsEn;
      settings: typeof settingsEn;
    };
  }
}

export type AppNamespaces = [
  "common",
  "nav",
  "auth",
  "home",
  "subjects",
  "tests",
  "questions",
  "answers",
  "users",
  "testSessions",
  "settings",
];

export type AppTFunction = TFunction<readonly AppNamespaces>;

export type I18nKey = ParseKeys<readonly AppNamespaces>;
