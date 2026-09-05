import type { StudentDto } from "@/pages/users/dtos/student.dto";
import type { UserDto } from "@/pages/users/dtos/user.dto";

export class SignUpResponseDto {
  token!: string;

  user!: UserDto & {
    student: StudentDto;
  };
}
