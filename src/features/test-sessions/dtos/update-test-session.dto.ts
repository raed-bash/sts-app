export class UpdateTestSessionDto {
  id!: number;

  startAt!: string;

  endAt!: string;

  constructor(id: number, session: { startAt: string; endAt: string }) {
    this.id = id;
    this.startAt = new Date(session.startAt).toISOString();
    this.endAt = new Date(session.endAt).toISOString();
  }
}