import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { UserDto } from "../dtos/user.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const restoreUser = async (id: number): Promise<UserDto> => {
  return (await api.post(ep("users", id, "restore"))).data;
};

type UseRestoreUserOptions = {
  mutationConfig?: MutationConfig<typeof restoreUser>;
};

export const useRestoreUser = ({
  mutationConfig,
}: UseRestoreUserOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: restoreUser,
  });
};
