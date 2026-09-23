export type SyntheticEventHandler<T = unknown> = (e: SyntheticEvent<T>) => void;

export class SyntheticEvent<T = unknown> {
  target: { name: string; value?: T; checked?: boolean };

  constructor(name: string, value?: T, checked?: boolean) {
    this.target = { name, value, checked };
  }
}
