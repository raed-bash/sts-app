import { pick } from "lodash";

export class SettingDto {
  key!: string;

  value!: string;

  constructor(setting: SettingDto) {
    Object.assign(this, pick(setting, ["key", "value"]));
  }
}