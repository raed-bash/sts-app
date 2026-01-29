import { pick } from "lodash";
import type { StudentDto } from "./student.dto";
import type { TeacherDto } from "./teacher.dto";

export type UserStatus = "PENDING" | "ACTIVE" | "BLOCKED";

export type UserRole = "SUPER_ADMIN" | "TEACHER" | "STUDENT";

export class UserDto {
  id!: number;

  username!: string;

  status!: UserStatus;

  role!: UserRole;

  created_at!: Date;

  updated_at?: Date | null;

  deleted_at?: Date | null;

  student?: StudentDto | null;

  teacher?: TeacherDto | null;

  constructor(user: UserDto) {
    Object.assign(
      this,
      pick(user, [
        "id",
        "username",
        "status",
        "role",
        "created_at",
        "updated_at",
        "deleted_at",
        "student",
        "teacher",
      ]),
    );
  }
}
