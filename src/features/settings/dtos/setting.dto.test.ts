import { describe, expect, it } from "vitest";
import { SettingDto } from "./setting.dto";

describe("SettingDto", () => {
  it("builds a SettingDto from the allowed fields", () => {
    const dto = new SettingDto({
      key: "darkMode",
      value: "1",
      extra: "dropped",
    } as unknown as SettingDto);

    expect(dto).toEqual({ key: "darkMode", value: "1" });
  });
});
