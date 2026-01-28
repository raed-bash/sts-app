type TokenPayload = {
  is_staff: boolean;
  is_manager: boolean;
  username: string;
  committee: number;
  user_id: number;
  exp: number;
  iat: number;
  jti: string;
  token_type: "access" | "refresh";
};
export class TokenHelpers {
  static decodedToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(atob(base64));
      return decodedPayload;
    } catch {
      return null;
    }
  }

  static getPayload(token: string) {
    if (!token) {
      return null;
    }

    const decodedPayload = this.decodedToken(token);

    return decodedPayload;
  }
}
