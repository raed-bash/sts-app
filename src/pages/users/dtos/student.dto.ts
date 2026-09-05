import type { Gender } from "@/constants/gender";
import type { UserDto } from "./user.dto";

export class StudentDto {
  id!: number;

  fullName!: string;

  user!: UserDto;

  gender!: Gender;

  isNameViewed!: boolean;
}
