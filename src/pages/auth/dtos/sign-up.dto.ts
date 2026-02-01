import { pick } from "lodash";
import type { Gender } from "src/constants/gender";

export class SignUpDto {
  username!: string;

  password!: string;

  full_name!: string;

  gender!: Gender;

  is_name_viewed!: boolean;

  constructor(signUp: SignUpDto) {
    Object.assign(
      this,
      pick(signUp, [
        "username",
        "password",
        "full_name",
        "gender",
        "is_name_viewed",
      ]),
    );
  }
}
