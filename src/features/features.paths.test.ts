import { describe, expect, it } from "vitest";
import { answersPaths } from "./answers/answers.paths";
import { authPaths } from "./auth/auth.paths";
import { homePaths } from "./home/home.paths";
import { questionsPaths } from "./questions/questions.paths";
import { settingsPaths } from "./settings/settings.paths";
import { subjectsPaths } from "./subjects/subjects.paths";
import { testSessionsPaths } from "./test-sessions/test-sessions.paths";
import { testsPaths } from "./tests/tests.paths";
import { usersPaths } from "./users/users.paths";

describe("feature paths", () => {
  it("defines the auth paths", () => {
    expect(authPaths.login).toBe("login");
    expect(authPaths.signUp).toBe("sign-up");
  });

  it("defines the home path", () => {
    expect(homePaths.home).toBe("home");
  });

  it("defines the users path", () => {
    expect(usersPaths.list).toBe("users");
  });

  it("defines the settings path", () => {
    expect(settingsPaths.settings).toBe("settings");
  });

  it("defines the answers path", () => {
    expect(answersPaths.list).toBe("answers");
  });

  it("defines the subjects paths with a detail link builder", () => {
    expect(subjectsPaths.list).toBe("subjects");
    expect(subjectsPaths.detail).toBe("subjects/:id");
    expect(subjectsPaths.subjectDetailLink(7)).toBe("/subjects/7");
  });

  it("defines the tests paths with a detail link builder", () => {
    expect(testsPaths.list).toBe("tests");
    expect(testsPaths.detail).toBe("tests/:id");
    expect(testsPaths.testDetailLink(7)).toBe("/tests/7");
  });

  it("defines the questions paths with a detail link builder", () => {
    expect(questionsPaths.list).toBe("questions");
    expect(questionsPaths.detail).toBe("questions/:id");
    expect(questionsPaths.questionDetailLink(7)).toBe("/questions/7");
  });

  it("defines the test-sessions paths with result and exam link builders", () => {
    expect(testSessionsPaths.list).toBe("test-sessions");
    expect(testSessionsPaths.results).toBe("test-sessions/:id/results");
    expect(testSessionsPaths.exam).toBe("test-sessions/:id/exam");
    expect(testSessionsPaths.resultsLink(7)).toBe("/test-sessions/7/results");
    expect(testSessionsPaths.examLink(7)).toBe("/test-sessions/7/exam");
  });
});
