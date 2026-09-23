import { describe, expect, it } from "vitest";
import { dateFormatter } from "./dates";

describe("dateFormatter", () => {
  it("formats a date as a datetime with a period", () => {
    expect(dateFormatter(new Date(2024, 0, 5, 15, 30, 45))).toBe(
      "2024-01-05, 03:30:45 PM",
    );
  });

  it("formats midnight as AM", () => {
    expect(dateFormatter(new Date(2024, 5, 1, 0, 5, 9))).toBe(
      "2024-06-01, 12:05:09 AM",
    );
  });

  it("formats only the date part when requested", () => {
    expect(dateFormatter(new Date(2024, 0, 5, 15, 30, 45), "date")).toBe(
      "2024-01-05",
    );
  });

  it("accepts strings and timestamps", () => {
    const timestamp = new Date(2024, 11, 24, 9, 0, 0).getTime();

    expect(dateFormatter("2024-12-24", "date")).toBe("2024-12-24");
    expect(dateFormatter(timestamp, "date")).toBe("2024-12-24");
  });

  it("returns an empty string for empty or invalid input", () => {
    expect(dateFormatter(null)).toBe("");
    expect(dateFormatter(undefined)).toBe("");
    expect(dateFormatter("not a date")).toBe("");
  });
});
