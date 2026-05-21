import type { UserDto } from "./user.dto";

export class TeacherDto {
  id!: number;

  fullName!: string;

  user!: UserDto;
}
