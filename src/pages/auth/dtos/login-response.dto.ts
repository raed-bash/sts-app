import type { StudentDto } from "@/pages/users/dtos/student.dto";
import type { UserDto } from "@/pages/users/dtos/user.dto";

export class LoginResponseDto {
  message!: string;

  token!: string;

  user!: UserDto & {
    student: StudentDto;
  };
}
