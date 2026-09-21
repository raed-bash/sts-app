import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { UserDto } from "../dtos/user.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { UpdateUserDto } from "../dtos/update-user.dto";

const updateUser = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateUserDto;
}): Promise<UserDto> => {
  return (await api.patch(ep("users", id), data)).data;
};

type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({
  mutationConfig,
}: UseUpdateUserOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: updateUser,
  });
};
