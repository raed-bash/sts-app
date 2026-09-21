import { pick } from "lodash";

export class CreateTestDto {
  name!: string;

  period!: number;

  subjectIds!: number[];

  constructor(test: {
    name: string;
    period: number;
    subjects: { id: number }[];
  }) {
    Object.assign(this, pick(test, ["name", "period"]));
    this.subjectIds = test.subjects.map((subject) => subject.id);
  }
}
