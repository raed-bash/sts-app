export class CreateTestSessionDto {
  startDate!: string;

  testId!: number;

  subjectId!: number;

  period?: number;

  constructor(
    session: {
      startAt: string;
      period: number;
      test: { id: number } | null;
      subject: { id: number } | null;
    },
  ) {
    this.startDate = new Date(session.startAt).toISOString();
    this.testId = session.test?.id ?? 0;
    this.subjectId = session.subject?.id ?? 0;
    this.period = session.period > 0 ? session.period : undefined;
  }
}