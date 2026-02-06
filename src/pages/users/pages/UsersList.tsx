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
import { UserPages } from "../users.pages";
import Paper from "src/components/paper/Paper";
import useSelectRows from "src/hooks/useSelectRows";
import useHiddenColumnsLocalStorage from "src/hooks/useHiddenColumnsLocalStorage";
import { useState } from "react";
import useSorts from "src/hooks/useSorts";

export default function UsersList() {
  const usersQuery = useQuery({
    queryKey: [UserPages.users.key],
    queryFn: () => usersApi.getUsers(),
  });
  const { selectedRows, setSelectedRows } = useSelectRows(
    "any",
    new Set<number | string>(),
  );
  const [page, setPage] = useState(1);
  const { hiddenColumns, setHiddenColumns } =
    useHiddenColumnsLocalStorage("nmae");

  const { handleSortChange, sorts } = useSorts("users");
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
      <Paper className="p-0">
        <Table<UserDto>
          sortStatuses={sorts}
          onSortChange={handleSortChange}
          selectable
          onSelectRows={setSelectedRows}
          selectedRows={selectedRows}
          hideableColumns
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
          onPageChange={setPage}
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
                  <div className="flex gap-3 justify-start  ">
                    <Tooltip title="Edit" placement="top">
                      {/* <IconButton> */}
                      <EditIcon />
                      {/* </IconButton> */}
                    </Tooltip>
                    <Tooltip title="Remove" placement="top">
                      {/* <IconButton> */}
                      <RemoveIcon />
                      {/* </IconButton> */}
                    </Tooltip>
                  </div>
                );
              },
            },
          ]}
          rows={usersQuery.data?.data || []}
          count={30}
          currentPage={page}
          perPage={2}
        />
      </Paper>
    </div>
  );
}
