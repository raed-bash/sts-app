export class EventTarget<T = any> {
  target!: { name?: string; value?: T; checked?: boolean };

  constructor(name?: string, value?: T, checked?: boolean) {
    this.target = { name, value, checked };
  }

  setValue?(value: T) {
    this.target.value = value;

    return this;
  }
}
