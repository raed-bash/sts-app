import { describe, expect, it } from "vitest";
import { LoginDto } from "./login.dto";
import { LoginResponseDto } from "./login-response.dto";
import { SignUpDto } from "./sign-up.dto";
import { SignUpResponseDto } from "./sign-up-response.dto";

describe("auth DTOs", () => {
  it("exposes the login fields", () => {
    expect(Object.keys(new LoginDto()).sort()).toEqual([
      "password",
      "username",
    ]);
  });

  it("builds a SignUpDto from the given fields", () => {
    const dto = new SignUpDto({
      username: "basha",
      password: "12345678",
      fullName: "Basha Student",
      gender: "MALE",
      isNameViewed: true,
      extra: "dropped",
    } as never);

    expect(dto).toEqual({
      username: "basha",
      password: "12345678",
      fullName: "Basha Student",
      gender: "MALE",
      isNameViewed: true,
    });
  });

  it("exposes the login response fields", () => {
    expect(Object.keys(new LoginResponseDto()).sort()).toEqual([
      "message",
      "token",
      "user",
    ]);
  });

  it("exposes the sign-up response fields", () => {
    expect(Object.keys(new SignUpResponseDto()).sort()).toEqual([
      "token",
      "user",
    ]);
  });
});
