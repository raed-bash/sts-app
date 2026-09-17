import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { UserDto } from "../dtos/user.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { CreateUserDto } from "../dtos/create-user.dto";

const createUser = async (data: CreateUserDto): Promise<UserDto> => {
  return (await api.post(ep("users"), data)).data;
};

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({ mutationConfig }: UseCreateUserOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: createUser,
  });
};