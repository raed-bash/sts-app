import { LocalStorageHelper } from "./LocalStorageHelper";

const keyStore = "accessToken";
export class AuthHelper {
  static getAccesssToken() {
    try {
      const accessToken = LocalStorageHelper.getItem(keyStore);

      return accessToken;
    } catch (err) {
      return null;
    }
  }

  static setAccessToken(token) {
    LocalStorageHelper.setItem(keyStore, token);
  }

  static removeAccessToken() {
    LocalStorageHelper.removeItem("accessToken");
  }
}
