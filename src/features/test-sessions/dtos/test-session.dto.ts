import { pick } from "lodash";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import type { TestSessionStatus } from "@/constants/test-session-status";

export class TestSessionDto {
  id!: number;

  status!: TestSessionStatus;

  startDate!: Date;

  finishDate!: Date;

  test!: TestDto;

  updatedAt?: Date | null;

  deletedAt?: Date | null;

  constructor(testSession: TestSessionDto) {
    Object.assign(
      this,
      pick(testSession, [
        "id",
        "status",
        "startDate",
        "finishDate",
        "test",
        "updatedAt",
        "deletedAt",
      ]),
    );
  }
}