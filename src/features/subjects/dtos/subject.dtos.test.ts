import { describe, expect, it } from "vitest";
import { CreateSubjectDto } from "./create-subject.dto";
import { UpdateSubjectDto } from "./update-subject.dto";
import { SubjectDto } from "./subject.dto";
import { QuerySubjectDto } from "./query-subject.dto";

describe("subject DTOs", () => {
  it("builds a SubjectDto from the allowed fields", () => {
    const dto = new SubjectDto({
      id: 1,
      name: "Math",
      createdAt: new Date("2026-01-01"),
      extra: "dropped",
    } as unknown as SubjectDto);

    expect(dto).toEqual({
      id: 1,
      name: "Math",
      createdAt: new Date("2026-01-01"),
    });
  });

  it("keeps null dates", () => {
    const dto = new SubjectDto({
      id: 1,
      name: "Math",
      createdAt: new Date("2026-01-01"),
      updatedAt: null,
      deletedAt: null,
    } as SubjectDto);

    expect(dto.updatedAt).toBeNull();
    expect(dto.deletedAt).toBeNull();
  });

  it("builds a CreateSubjectDto", () => {
    expect(new CreateSubjectDto({ name: "Math" })).toEqual({ name: "Math" });
  });

  it("attaches the id on an UpdateSubjectDto", () => {
    expect(new UpdateSubjectDto(3, { name: "Physics" })).toEqual({
      id: 3,
      name: "Physics",
    });
  });
});

describe("QuerySubjectDto", () => {
  it("defaults to id ordering, desc direction and deleted-only filter", () => {
    const dto = new QuerySubjectDto({});

    expect(dto.orderBy).toBe("id");
    expect(dto.orderDir).toBe("desc");
    expect(dto.isDeleted).toBe(true);
  });

  it("passes name and testIds through", () => {
    const dto = new QuerySubjectDto({ name: "Ma", testIds: [1, 2] });

    expect(dto.name).toBe("Ma");
    expect(dto.testIds).toEqual([1, 2]);
  });

  it("applies the first sort to orderBy and orderDir", () => {
    const dto = new QuerySubjectDto({ sorts: { name: "desc" } as never });

    expect(dto.orderBy).toBe("name");
    expect(dto.orderDir).toBe("desc");
  });
});
