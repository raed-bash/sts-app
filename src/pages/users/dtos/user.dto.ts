import { pick } from "lodash";
import type { StudentDto } from "./student.dto";
import type { TeacherDto } from "./teacher.dto";
import type { UserRole } from "src/constants/user-role";
import type { UserStatus } from "src/constants/user-status";

export class UserDto {
  id!: number;

  username!: string;

  status!: UserStatus;

  role!: UserRole;

  createdAt!: Date;

  updatedAt?: Date | null;

  deletedAt?: Date | null;

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
        "createdAt",
        "updatedAt",
        "deletedAt",
        "student",
        "teacher",
      ])
    );
  }
}
