export type SyntheticEventHandler<T = any> = (e: SyntheticEvent<T>) => void;

export class SyntheticEvent<T = any> {
  target: { name?: string; value?: T; checked?: boolean };

  constructor(name?: string, value?: T, checked?: boolean) {
    this.target = { name, value, checked };
  }

  setValue(value: T) {
    this.target.value = value;
    return this;
  }
}
