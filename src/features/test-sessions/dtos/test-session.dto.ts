import { pick } from "lodash";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import type { TestSessionStatus } from "@/constants/test-session-status";
import type { StudentTestSessionStatus } from "@/constants/student-test-session-status";

export class TestSessionDto {
  id!: number;

  status!: TestSessionStatus;

  startDate!: Date;

  finishDate!: Date;

  test!: TestDto;

  updatedAt?: Date | null;

  deletedAt?: Date | null;

  subject?: { id: number; name: string };

  /** Students only: their own registration status, null when not registered. */
  myStatus?: StudentTestSessionStatus | null;

  registeredCount?: number;

  finishedCount?: number;

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
        "subject",
        "myStatus",
        "registeredCount",
        "finishedCount",
      ]),
    );
  }
}
