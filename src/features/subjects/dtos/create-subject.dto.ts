import { pick } from "lodash";

export class CreateSubjectDto {
  name!: string;

  constructor(subject: { name: string }) {
    Object.assign(this, pick(subject, ["name"]));
  }
}