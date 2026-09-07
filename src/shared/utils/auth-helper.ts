import { LocalStorageHelper } from "./local-storage-helper";

const keyStore = "accessToken";
export class AuthHelper {
  static getAccessToken() {
    try {
      const accessToken = LocalStorageHelper.getItem(keyStore);

      return accessToken;
    } catch {
      return null;
    }
  }

  static setAccessToken(token: string) {
    LocalStorageHelper.setItem(keyStore, token);
  }

  static removeAccessToken() {
    LocalStorageHelper.removeItem("accessToken");
  }
}
