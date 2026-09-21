import { pick } from "lodash";

export class UpdateSubjectDto {
  id!: number;

  name!: string;

  constructor(id: number, subject: { name: string }) {
    this.id = id;
    Object.assign(this, pick(subject, ["name"]));
  }
}
