import { ep } from "@/constants/endpoints";
import type { LoginDto } from "../dtos/login.dto";
import { api } from "@/lib/api";
import type { LoginResponseDto } from "../dtos/login-response.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export const login = async (data: LoginDto): Promise<LoginResponseDto> =>
  (await api.post(ep("auth", "login"), data, { hideToasterMessage: true }))
    .data;

type UseLoginOptions = {
  mutationConfig?: MutationConfig<typeof login>;
};

export const useLogin = ({ mutationConfig }: UseLoginOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: login,
  });
};
