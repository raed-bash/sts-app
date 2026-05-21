import type { UserDto } from "./user.dto";

export class TeacherDto {
  id!: number;

  full_name!: string;

  user!: UserDto;
}
