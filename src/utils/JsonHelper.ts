export class JsonHelper {
  static parse(text: string) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  static stringify(value: any) {
    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  }
}
