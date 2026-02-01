import { api } from "src/app/axios";
import { ep } from "src/constants/endpoints";
import type { UserDto } from "./dtos/user.dto";

export const usersApi = {
  me: async () => (await api.get<UserDto>(ep("users", "me"))).data,
};
