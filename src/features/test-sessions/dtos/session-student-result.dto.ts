import { pick } from "lodash";

export class SessionStudentResultDto {
  id!: number;

  username!: string;

  fullName!: string;

  status: "PENDING" | "STARTED" | "FINISHED" | "CANCELED" = "PENDING";

  points!: number;

  studentPoints!: number;

  percentage!: number;

  constructor(sessionStudent: SessionStudentResultDto) {
    Object.assign(
      this,
      pick(sessionStudent, [
        "id",
        "username",
        "fullName",
        "status",
        "points",
        "studentPoints",
        "percentage",
      ]),
    );
  }
}