import { pick } from "lodash";

export class SubjectDto {
  id!: number;
  name!: string;
  createdAt!: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  testsCount?: number;
  sessionsCount?: number;

  constructor(subject: SubjectDto) {
    Object.assign(
      this,
      pick(subject, [
        "id",
        "name",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "testsCount",
        "sessionsCount",
      ]),
    );
  }
}
