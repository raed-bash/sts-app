import { beforeEach, describe, expect, it } from "vitest";
import { LocalStorageHelper } from "./local-storage-helper";
import { AuthHelper } from "./auth-helper";

describe("LocalStorageHelper", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("sets and gets a raw item", () => {
    LocalStorageHelper.setItem("key", '{"a":1}');

    expect(LocalStorageHelper.getItem("key")).toBe('{"a":1}');
  });

  it("returns an empty string for missing items", () => {
    expect(LocalStorageHelper.getItem("missing")).toBe("");
  });

  it("parses a stored item safely", () => {
    LocalStorageHelper.setItem("key", '{"a":1}');

    expect(LocalStorageHelper.safeParsedGetItem("key")).toEqual({ a: 1 });
  });

  it("returns null for malformed stored items", () => {
    LocalStorageHelper.setItem("key", "not json");

    expect(LocalStorageHelper.safeParsedGetItem("key")).toBeNull();
  });

  it("removes a stored item", () => {
    LocalStorageHelper.setItem("key", "value");
    LocalStorageHelper.removeItem("key");

    expect(LocalStorageHelper.getItem("key")).toBe("");
  });
});

describe("AuthHelper", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty access token when nothing is stored", () => {
    expect(AuthHelper.getAccessToken()).toBe("");
  });

  it("stores and retrieves the access token", () => {
    AuthHelper.setAccessToken("tok-123");

    expect(AuthHelper.getAccessToken()).toBe("tok-123");
  });

  it("removes the access token", () => {
    AuthHelper.setAccessToken("tok-123");
    AuthHelper.removeAccessToken();

    expect(AuthHelper.getAccessToken()).toBe("");
  });
});
