import { describe, expect, it } from "vitest";
import { GENDERS } from "./gender";
import { ROLE_TITLES } from "./user-role";
import { QUESTION_TYPE_TITLES } from "./question-type";
import { STATUS_TITLES } from "./user-status";
import { TEST_SESSION_STATUS_TITLES } from "./test-session-status";
import { STUDENT_TEST_SESSION_STATUS_TITLES } from "./student-test-session-status";

describe("gender constants", () => {
  it("exposes the supported genders", () => {
    expect(GENDERS).toEqual(["MALE", "FEMALE"]);
  });
});

describe("role titles", () => {
  it("maps every role to a translation key", () => {
    expect(Object.keys(ROLE_TITLES).sort()).toEqual([
      "STUDENT",
      "SUPER_ADMIN",
      "TEACHER",
    ]);

    Object.values(ROLE_TITLES).forEach((key) => {
      expect(key).toMatch(/^common:roles\./);
    });
  });
});

describe("question type titles", () => {
  it("maps every question type to a translation key", () => {
    expect(Object.keys(QUESTION_TYPE_TITLES).sort()).toEqual([
      "CHOOSE",
      "COMPLETE",
      "DRAG_DROP",
    ]);

    Object.values(QUESTION_TYPE_TITLES).forEach((key) => {
      expect(key).toMatch(/^common:questionTypes\./);
    });
  });
});

describe("status titles", () => {
  it("maps user statuses to translation keys", () => {
    expect(Object.keys(STATUS_TITLES).sort()).toEqual([
      "ACTIVE",
      "BLOCKED",
      "PENDING",
    ]);

    Object.values(STATUS_TITLES).forEach((key) => {
      expect(key).toMatch(/^common:statuses\./);
    });
  });

  it("shares the same status set across session statuses", () => {
    expect(TEST_SESSION_STATUS_TITLES).toEqual(
      STUDENT_TEST_SESSION_STATUS_TITLES,
    );

    expect(Object.keys(TEST_SESSION_STATUS_TITLES).sort()).toEqual([
      "CANCELED",
      "FINISHED",
      "PENDING",
      "STARTED",
    ]);
  });
});
