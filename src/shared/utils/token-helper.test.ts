import { describe, expect, it } from "vitest";
import { TokenHelpers } from "./token-helper";

const b64url = (payload: object) => {
  const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

describe("TokenHelpers", () => {
  it("decodes the payload of a jwt", () => {
    const token = `header.${b64url({ sub: 1, role: "admin" })}.signature`;

    expect(TokenHelpers.decodedToken(token)).toMatchObject({
      sub: 1,
      role: "admin",
    });
  });

  it("returns null for a malformed token", () => {
    expect(TokenHelpers.decodedToken("not-a-jwt")).toBeNull();
  });

  it("ignores the signature check for round trips", () => {
    const token = `h.${b64url({ iat: 123 })}.s`;

    expect(TokenHelpers.getPayload(token)).toMatchObject({ iat: 123 });
  });

  it("returns null for an empty token", () => {
    expect(TokenHelpers.getPayload("")).toBeNull();
    expect(TokenHelpers.getPayload(undefined as unknown as string)).toBeNull();
  });
});
