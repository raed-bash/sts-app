import { api } from "src/app/axios";
import { ep } from "src/constants/endpoints";
import type { LoginDataDto } from "./dtos/login-data.dto";
import { LoginResponseDto } from "./dtos/login-response.dto";

export const authApi = {
  login: async (data: LoginDataDto) =>
    (
      await api.post<LoginResponseDto>(ep("auth", "login"), data, {
        hideToasterMessage: true,
      })
    ).data,
};
