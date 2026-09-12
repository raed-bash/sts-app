import { Edit, Trash } from "lucide-react";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import UsersTable from "../components/UsersTable";
import UsersInputsPlayground from "../components/UsersInputsPlayground";
import { QueryUserDto } from "../dtos/query-user.dto";
import type { UserDto } from "../dtos/user.dto";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getUsersQueryOptions } from "../api/get-users.api";
import type { QueryClient } from "@tanstack/react-query";
import { useUsersTable } from "../hooks/useUsersTable";

// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getUsersQueryOptions(new QueryUserDto({}));

  return (
    queryClient.getQueryData(query.queryKey) ?? (await queryClient.query(query))
  );
};

export default function UsersList() {
  const { tableProps } = useUsersTable();

  const actions: TableAction<UserDto>[] = [
    {
      name: "edit",
      label: "Edit",
      icon: <Edit />,
      onClick: (user) => console.log("edit", user),
    },
    {
      name: "delete",
      label: "Remove",
      icon: <Trash />,
      variant: "destructive",
      onClick: (user) => console.log("delete", user),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <UsersInputsPlayground />
      <Card className="pb-52">
        <CardContent>
          <UsersTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>
    </div>
  );
}
