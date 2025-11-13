/**
 * @typedef TokenPayload
 * @property {boolean} is_staff
 * @property {boolean} is_manager
 * @property {string} username
 * @property {number} committee
 * @property {number} user_id
 * @property {number} exp
 * @property {number} iat
 * @property {string} jti
 * @property {"access"|"refresh"} token_type
 *
 */

export class TokenHelpers {
  static decodedToken(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(atob(base64));
      return decodedPayload;
    } catch {
      return null;
    }
  }

  /**
   *
   * @param {string} token
   * @returns {TokenPayload|null}
   */
  static getPayload(token) {
    if (!token) {
      return null;
    }

    const decodedPayload = this.decodedToken(token);

    return decodedPayload;
  }
}
