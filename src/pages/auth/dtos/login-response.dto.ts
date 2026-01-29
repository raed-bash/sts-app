import type { UserDto } from "src/pages/users/dtos/user.dto";

export class LoginResponseDto {
  message!: string;

  token!: string;

  user!: UserDto;
}
