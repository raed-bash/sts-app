import { beforeEach, describe, expect, it } from "vitest";
import { api, setAuthToken } from "./api";
import { env } from "@/config/env";

describe("api", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("points at the api url and sends json", () => {
    expect(api.defaults.baseURL).toBe(env.API_URL);
    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("sets the authorization header for a token", () => {
    setAuthToken("abc");

    expect(api.defaults.headers.Authorization).toBe("Bearer abc");
  });

  it("removes the authorization header for a null token", () => {
    setAuthToken("abc");

    setAuthToken(null);

    expect(api.defaults.headers.Authorization).toBeUndefined();
  });
});
