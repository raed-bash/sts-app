export class JsonHelper {
  static parse(text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  static stringify(value) {
    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  }
}
