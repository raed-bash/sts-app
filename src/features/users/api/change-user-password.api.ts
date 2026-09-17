import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { UserDto } from "../dtos/user.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { ChangePasswordDto } from "../dtos/change-password.dto";

const changeUserPassword = async (
  data: ChangePasswordDto,
): Promise<UserDto> => {
  return (
    await api.patch(ep("users", data.id, "change-password"), {
      password: data.password,
    })
  ).data;
};

type UseChangeUserPasswordOptions = {
  mutationConfig?: MutationConfig<typeof changeUserPassword>;
};

export const useChangeUserPassword = ({
  mutationConfig,
}: UseChangeUserPasswordOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: changeUserPassword,
  });
};