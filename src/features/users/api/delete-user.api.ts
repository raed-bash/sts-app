import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { UserDto } from "../dtos/user.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const deleteUser = async (id: number): Promise<UserDto> => {
  return (await api.delete(ep("users", id))).data;
};

type UseDeleteUserOptions = {
  mutationConfig?: MutationConfig<typeof deleteUser>;
};

export const useDeleteUser = ({ mutationConfig }: UseDeleteUserOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: deleteUser,
  });
};