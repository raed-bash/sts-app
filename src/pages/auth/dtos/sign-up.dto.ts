import { pick } from "lodash";
import type { Gender } from "src/constants/gender";

export class SignUpDto {
  username!: string;

  password!: string;

  fullName!: string;

  gender!: Gender;

  isNameViewed!: boolean;

  constructor(signUp: SignUpDto) {
    Object.assign(
      this,
      pick(signUp, [
        "username",
        "password",
        "fullName",
        "gender",
        "isNameViewed",
      ]),
    );
  }
}
