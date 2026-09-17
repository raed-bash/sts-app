import { pick } from "lodash";

export class CreateUserDto {
  username!: string;

  password!: string;

  role!: string;

  status!: string;

  constructor(user: {
    username: string;
    password: string;
    role: string;
    status: string;
  }) {
    Object.assign(this, pick(user, ["username", "password", "role", "status"]));
  }
}