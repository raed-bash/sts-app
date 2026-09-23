import { describe, expect, it } from "vitest";
import { TestDto } from "./test.dto";
import { CreateTestDto } from "./create-test.dto";
import { UpdateTestDto } from "./update-test.dto";
import { QueryTestDto } from "./query-test.dto";

describe("test DTOs", () => {
  it("builds a TestDto from the allowed fields", () => {
    const dto = new TestDto({
      id: 1,
      name: "Midterm",
      period: 60,
      createdAt: new Date("2026-01-01"),
      tests: "dropped",
    } as unknown as TestDto);

    expect(dto).toEqual({
      id: 1,
      name: "Midterm",
      period: 60,
      createdAt: new Date("2026-01-01"),
    });
  });

  it("maps subject ids on a CreateTestDto", () => {
    const dto = new CreateTestDto({
      name: "Midterm",
      period: 60,
      subjects: [{ id: 1 }, { id: 2 }, { id: 999 }],
    });

    expect(dto.subjectIds).toEqual([1, 2, 999]);
    expect(dto.name).toBe("Midterm");
    expect(dto.period).toBe(60);
  });

  it("maps subject ids on an UpdateTestDto", () => {
    const dto = new UpdateTestDto({
      name: "Final",
      period: 90,
      subjects: [{ id: 7 }],
    });

    expect(dto).toEqual({ name: "Final", period: 90, subjectIds: [7] });
  });

  it("drops unrelated create fields", () => {
    const dto = new CreateTestDto({
      name: "Midterm",
      period: 60,
      subjects: [{ id: 1 }],
      extra: "dropped",
    } as never);

    expect(dto).not.toHaveProperty("extra");
  });
});

describe("QueryTestDto", () => {
  it("defaults to id ordering, desc direction and deleted-only filter", () => {
    const dto = new QueryTestDto({});

    expect(dto.orderBy).toBe("id");
    expect(dto.orderDir).toBe("desc");
    expect(dto.isDeleted).toBe(true);
  });

  it("passes filters through", () => {
    const dto = new QueryTestDto({ name: "Mid", subjectIds: [3] });

    expect(dto.name).toBe("Mid");
    expect(dto.subjectIds).toEqual([3]);
  });

  it("applies the first sort to orderBy and orderDir", () => {
    const dto = new QueryTestDto({ sorts: { name: "asc" } as never });

    expect(dto.orderBy).toBe("name");
    expect(dto.orderDir).toBe("asc");
  });
});
