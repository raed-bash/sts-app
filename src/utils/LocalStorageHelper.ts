export class LocalStorageHelper {
  static setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  static getItem(key: string) {
    return localStorage.getItem(key) || "";
  }

  static safeParsedGetItem(key: string) {
    try {
      return JSON.parse(this.getItem(key));
    } catch {
      return null;
    }
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
