export type ENDPOINTS =
  | "login"
  | "users"
  | "auth"
  | "sign-up"
  | "me"
  | "subjects"
  | "tests"
  | "questions"
  | "answers"
  | "test-sessions"
  | "settings"
  | "healthcheck"
  | "start"
  | "finish"
  | "register"
  | "start-student-test-session"
  | "submit"
  | "results"
  | "restore"
  | "change-password"
  | "change-my-password"
  | "deattach-subject"
  | "deattach-test"
  | "check-student-test-sessions"
  | "exam";

export const ep = (...endpoints: (ENDPOINTS | number | string)[]) =>
  endpoints.join("/").toString();
