import { ep } from "@/constants/endpoints";
import type { SignUpDto } from "../dtos/sign-up.dto";
import { api } from "@/lib/api";
import type { SignUpResponseDto } from "../dtos/sign-up-response.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export const signUp = async (data: SignUpDto): Promise<SignUpResponseDto> =>
  (await api.post(ep("auth", "sign-up"), data, { hideToasterMessage: true }))
    .data;

type UseSignUpOptions = {
  mutationConfig?: MutationConfig<typeof signUp>;
};

export const useSignUp = ({ mutationConfig }: UseSignUpOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: signUp,
  });
};
