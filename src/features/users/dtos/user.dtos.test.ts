import { describe, expect, it } from "vitest";
import { PER_PAGE } from "@/shared/dtos/pagingated-results-dto";
import { CreateUserDto } from "./create-user.dto";
import { UserDto } from "./user.dto";
import { ChangePasswordDto } from "./change-password.dto";
import { QueryUserDto } from "./query-user.dto";
import { UpdateUserDto } from "./update-user.dto";
import { StudentDto } from "./student.dto";
import { TeacherDto } from "./teacher.dto";

describe("user DTOs", () => {
  it("builds a UserDto from the allowed fields", () => {
    const dto = new UserDto({
      id: 1,
      username: "basha",
      status: "ACTIVE",
      role: "STUDENT",
      createdAt: new Date("2026-01-01"),
      updatedAt: null,
      deletedAt: null,
      student: {} as StudentDto,
      extra: "dropped",
    } as unknown as UserDto);

    expect(dto).toEqual({
      id: 1,
      username: "basha",
      status: "ACTIVE",
      role: "STUDENT",
      createdAt: new Date("2026-01-01"),
      updatedAt: null,
      deletedAt: null,
      student: {},
    });
  });

  it("builds a CreateUserDto with the given fields", () => {
    const dto = new CreateUserDto({
      username: "basha",
      password: "12345678",
      role: "STUDENT",
      status: "ACTIVE",
      extra: "dropped",
    } as never);

    expect(dto).toEqual({
      username: "basha",
      password: "12345678",
      role: "STUDENT",
      status: "ACTIVE",
    });
  });

  it("attaches the id on an UpdateUserDto", () => {
    const dto = new UpdateUserDto(7, {
      username: "basha",
      role: "TEACHER",
      status: "PENDING",
    });

    expect(dto).toEqual({
      id: 7,
      username: "basha",
      role: "TEACHER",
      status: "PENDING",
    });
  });

  it("builds a ChangePasswordDto", () => {
    expect(new ChangePasswordDto(7, "12345678")).toEqual({
      id: 7,
      password: "12345678",
    });
  });

  it("exposes plain student and teacher DTO types", () => {
    const student = { id: 1, fullName: "Basha" } as StudentDto;
    const teacher = { id: 2, fullName: "Dr. X" } as TeacherDto;

    expect(student.fullName).toBe("Basha");
    expect(teacher.fullName).toBe("Dr. X");
  });
});

describe("QueryUserDto", () => {
  it("defaults to the first page, PER_PAGE size, id ordering and desc direction", () => {
    const dto = new QueryUserDto({});

    expect(dto.page).toBe(1);
    expect(dto.perPage).toBe(PER_PAGE);
    expect(dto.orderBy).toBe("id");
    expect(dto.orderDir).toBe("desc");
    expect(dto.isDeleted).toBe(true);
  });

  it("passes filters through", () => {
    const dto = new QueryUserDto({ username: "ba", role: "STUDENT" });

    expect(dto.username).toBe("ba");
    expect(dto.role).toBe("STUDENT");
  });

  it("applies the first sort to orderBy and orderDir", () => {
    const dto = new QueryUserDto({ sorts: { username: "asc" } as never });

    expect(dto.orderBy).toBe("username");
    expect(dto.orderDir).toBe("asc");
  });

  it("keeps the default sort when sorts is empty", () => {
    const dto = new QueryUserDto({ sorts: {} as never });

    expect(dto.orderBy).toBe("id");
    expect(dto.orderDir).toBe("desc");
  });
});
