import type { StudentDto } from "src/pages/users/dtos/student.dto";
import type { UserDto } from "src/pages/users/dtos/user.dto";

export class SignUpResponseDto {
  token!: string;

  user!: UserDto & {
    student: StudentDto;
  };
}
