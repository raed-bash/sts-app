import { pick } from "lodash";

export class UpdateUserDto {
  id!: number;

  username?: string;

  role?: string;

  status?: string;

  constructor(id: number, user: { username: string; role: string; status: string }) {
    this.id = id;
    Object.assign(this, pick(user, ["username", "role", "status"]));
  }
}