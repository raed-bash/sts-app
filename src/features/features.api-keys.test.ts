import { describe, expect, it } from "vitest";
import { answersQueryKeys } from "./answers/answers.api-keys";
import { questionsQueryKeys } from "./questions/questions.api-keys";
import { settingsQueryKeys } from "./settings/settings.api-keys";
import { subjectsQueryKeys } from "./subjects/subjects.api-keys";
import { testSessionsQueryKeys } from "./test-sessions/test-sessions.api-keys";
import { testsQueryKeys } from "./tests/tests.api-keys";
import { usersQueryKeys } from "./users/users.api-keys";

describe("feature query keys factory", () => {
  it("builds users keys", () => {
    expect(usersQueryKeys.all).toEqual(["users"]);
    expect(usersQueryKeys.list()).toEqual(["users", "list"]);
    expect(usersQueryKeys.list({ page: 1 } as never)).toEqual([
      "users",
      "list",
      { page: 1 },
    ]);
    expect(usersQueryKeys.infiniteList()).toEqual(["users", "infinite-list"]);
    expect(usersQueryKeys.byId("5")).toEqual(["users", "5"]);
    expect(usersQueryKeys.me()).toEqual(["users", "me"]);
  });

  it("builds subjects keys", () => {
    expect(subjectsQueryKeys.all).toEqual(["subjects"]);
    expect(subjectsQueryKeys.list({ page: 2 } as never)).toEqual([
      "subjects",
      "list",
      { page: 2 },
    ]);
    expect(subjectsQueryKeys.infiniteList()).toEqual([
      "subjects",
      "infinite-list",
    ]);
    expect(subjectsQueryKeys.byId("9")).toEqual(["subjects", "9"]);
  });

  it("builds tests keys", () => {
    expect(testsQueryKeys.all).toEqual(["tests"]);
    expect(testsQueryKeys.list({ page: 1 } as never)).toEqual([
      "tests",
      "list",
      { page: 1 },
    ]);
    expect(testsQueryKeys.infiniteList()).toEqual(["tests", "infinite-list"]);
    expect(testsQueryKeys.byId("3")).toEqual(["tests", "3"]);
  });

  it("builds questions keys", () => {
    expect(questionsQueryKeys.all).toEqual(["questions"]);
    expect(questionsQueryKeys.list({ page: 1 } as never)).toEqual([
      "questions",
      "list",
      { page: 1 },
    ]);
    expect(questionsQueryKeys.infiniteList()).toEqual([
      "questions",
      "infinite-list",
    ]);
    expect(questionsQueryKeys.byId("4")).toEqual(["questions", "4"]);
  });

  it("builds answers keys", () => {
    expect(answersQueryKeys.all).toEqual(["answers"]);
    expect(answersQueryKeys.list({ page: 1 } as never)).toEqual([
      "answers",
      "list",
      { page: 1 },
    ]);
    expect(answersQueryKeys.infiniteList()).toEqual([
      "answers",
      "infinite-list",
    ]);
    expect(answersQueryKeys.byId("2")).toEqual(["answers", "2"]);
  });

  it("builds settings keys", () => {
    expect(settingsQueryKeys.all).toEqual(["settings"]);
    expect(settingsQueryKeys.list()).toEqual(["settings", "list"]);
    expect(settingsQueryKeys.byKey("darkMode")).toEqual([
      "settings",
      "darkMode",
    ]);
  });

  it("builds test-sessions keys", () => {
    expect(testSessionsQueryKeys.all).toEqual(["test-sessions"]);
    expect(testSessionsQueryKeys.list({ page: 1 } as never)).toEqual([
      "test-sessions",
      "list",
      { page: 1 },
    ]);
    expect(testSessionsQueryKeys.infiniteList()).toEqual([
      "test-sessions",
      "infinite-list",
    ]);
    expect(testSessionsQueryKeys.byId("8")).toEqual(["test-sessions", "8"]);
    expect(testSessionsQueryKeys.exam(8)).toEqual(["test-sessions", "exam", 8]);
    expect(testSessionsQueryKeys.exam("8")).toEqual([
      "test-sessions",
      "exam",
      "8",
    ]);
    expect(testSessionsQueryKeys.results(8)).toEqual([
      "test-sessions",
      "results",
      8,
    ]);
    expect(testSessionsQueryKeys.results(8, 3)).toEqual([
      "test-sessions",
      "results",
      8,
      3,
    ]);
    expect(testSessionsQueryKeys.students(8)).toEqual([
      "test-sessions",
      "students",
      8,
    ]);
    expect(testSessionsQueryKeys.checkStudentTestSessions()).toEqual([
      "test-sessions",
      "check-student-test-sessions",
    ]);
  });
});
