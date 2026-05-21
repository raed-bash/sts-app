import { api } from "src/app/axios";
import { ep } from "src/constants/endpoints";
import type { LoginDataDto } from "./dtos/login-data.dto";
import { LoginResponseDto } from "./dtos/login-response.dto";
import type { SignUpDto } from "./dtos/sign-up.dto";
import type { SignUpResponseDto } from "./dtos/sign-up-response.dto";

export const authApi = {
  login: async (data: LoginDataDto) =>
    (
      await api.post<LoginResponseDto>(ep("auth", "login"), data, {
        hideToasterMessage: true,
      })
    ).data,
  signUp: async (data: SignUpDto) =>
    (await api.post<SignUpResponseDto>(ep("auth", "sign-up"), data)).data,
};
