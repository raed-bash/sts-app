import { pick } from "lodash";
import type { StudentTestSessionStatus } from "@/constants/student-test-session-status";

export class StudentTestSessionDto {
  status!: StudentTestSessionStatus;

  registeredAt!: Date;

  startedAt?: Date | null;

  finishedAt?: Date | null;

  studentId!: number;

  testSessionId!: number;

  constructor(studentTestSession: StudentTestSessionDto) {
    Object.assign(
      this,
      pick(studentTestSession, [
        "status",
        "registeredAt",
        "startedAt",
        "finishedAt",
        "studentId",
        "testSessionId",
      ]),
    );
  }
}
