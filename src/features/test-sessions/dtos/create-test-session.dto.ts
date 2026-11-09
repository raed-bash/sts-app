export class CreateTestSessionDto {
  startDate!: string;

  testId!: number;

  subjectId!: number;

  constructor(session: {
    startAt: string;
    test: { id: number } | null;
    subject: { id: number } | null;
  }) {
    this.startDate = new Date(session.startAt).toISOString();
    this.testId = session.test?.id ?? 0;
    this.subjectId = session.subject?.id ?? 0;
  }
}
