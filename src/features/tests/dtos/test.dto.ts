import { pick } from "lodash";

export class TestDto {
  id!: number;
  name!: string;
  period!: number;
  createdAt!: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;

  constructor(test: TestDto) {
    Object.assign(
      this,
      pick(test, [
        "id",
        "name",
        "period",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ]),
    );
  }
}
