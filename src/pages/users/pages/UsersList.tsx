import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../users.api";
import Table from "src/components/table/Table";
import type { UserDto } from "../dtos/user.dto";
import StatusView from "src/components/StatusView";
import RoleView from "src/components/RoleView";
import { dateFormater } from "src/utils/dateFormater";
import InputPlus from "src/components/inputs/InputPlus";
import AddIcon from "src/assets/icons/add.svg?react";
import EditIcon from "src/assets/icons/edit.svg?react";
import RemoveIcon from "src/assets/icons/remove.svg?react";
import IconButton from "src/components/buttons/IconButton";
import Tooltip from "src/components/tooltip/Tooltip";

export default function UsersList() {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers(),
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <div className="flex justify-between py-5">
        <InputPlus type="text" title="Search:" oneline />
        <Tooltip title="Create">
          <IconButton className="w-min ">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Table<UserDto>
        columns={[
          {
            name: "id",
            headerName: "#",
          },
          {
            name: "username",
            headerName: "Username",
          },
          {
            name: "full_name",
            headerName: "Full Name",
            getCell(_, row) {
              return row.student?.full_name || row.teacher?.full_name;
            },
          },
          {
            name: "status",
            headerName: "Status",
            getCell(status) {
              return <StatusView status={status} />;
            },
          },
          {
            name: "role",
            headerName: "Role",
            getCell(role) {
              return <RoleView role={role} />;
            },
          },
          {
            name: "created_at",
            headerName: "Created at",
            getCell(value) {
              return dateFormater(value);
            },
          },
          {
            name: "actions",
            headerName: "Actions",
            getCell() {
              return (
                <div className="flex gap-3 justify-center">
                  <Tooltip title="Edit">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove">
                    <IconButton>
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            },
          },
        ]}
        rows={usersQuery.data?.data || []}
        count={usersQuery.data?.meta.total}
        currentPage={1}
        perPage={10}
      />
    </div>
  );
}
