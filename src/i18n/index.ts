import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";
import enNav from "./locales/en/nav.json";
import enAuth from "./locales/en/auth.json";
import enHome from "./locales/en/home.json";
import enSubjects from "./locales/en/subjects.json";
import enTests from "./locales/en/tests.json";
import enQuestions from "./locales/en/questions.json";
import enAnswers from "./locales/en/answers.json";
import enUsers from "./locales/en/users.json";
import enTestSessions from "./locales/en/testSessions.json";
import enSettings from "./locales/en/settings.json";
import arCommon from "./locales/ar/common.json";
import arNav from "./locales/ar/nav.json";
import arAuth from "./locales/ar/auth.json";
import arHome from "./locales/ar/home.json";
import arSubjects from "./locales/ar/subjects.json";
import arTests from "./locales/ar/tests.json";
import arQuestions from "./locales/ar/questions.json";
import arAnswers from "./locales/ar/answers.json";
import arUsers from "./locales/ar/users.json";
import arTestSessions from "./locales/ar/testSessions.json";
import arSettings from "./locales/ar/settings.json";

export const i18nNamespaces = [
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
] as const;

export type I18nNamespace = (typeof i18nNamespaces)[number];

export const resources = {
  en: {
    common: enCommon,
    nav: enNav,
    auth: enAuth,
    home: enHome,
    subjects: enSubjects,
    tests: enTests,
    questions: enQuestions,
    answers: enAnswers,
    users: enUsers,
    testSessions: enTestSessions,
    settings: enSettings,
  },
  ar: {
    common: arCommon,
    nav: arNav,
    auth: arAuth,
    home: arHome,
    subjects: arSubjects,
    tests: arTests,
    questions: arQuestions,
    answers: arAnswers,
    users: arUsers,
    testSessions: arTestSessions,
    settings: arSettings,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
  ns: [...i18nNamespaces],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
