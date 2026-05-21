import type { Gender } from "src/constants/gender";
import type { UserDto } from "./user.dto";

export class StudentDto {
  id!: number;

  full_name!: string;

  user!: UserDto;

  gender!: Gender;

  is_name_viewed!: boolean;
}
