import { LocalStorageHelper } from "./LocalStorageHelper";

const keyStore = "accessToken";
export class AuthHelper {
  static getAccesssToken() {
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
