import type { StudentDto } from "@/features/users/dtos/student.dto";
import type { UserDto } from "@/features/users/dtos/user.dto";

export class LoginResponseDto {
  message!: string;

  token!: string;

  user!: UserDto & {
    student: StudentDto;
  };
}
