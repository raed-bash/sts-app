import Table, { type TableSortStatuses } from "src/components/table/Table";
import type { UserDto } from "../dtos/user.dto";
import Tooltip from "src/components/tooltip/Tooltip";
import { dateFormater } from "src/utils/dateFormater";
import RoleView from "src/components/RoleView";
import StatusView from "src/components/StatusView";
import EditIcon from "src/assets/icons/edit.svg?react";
import RemoveIcon from "src/assets/icons/remove.svg?react";
import type { UseTableUtilsSortEventHandler } from "src/components/table/hooks/useTableUtils";

export type UsersTableProps = {
  handleSortChange: UseTableUtilsSortEventHandler<UserDto>;
  sorts: TableSortStatuses;
  setSelectedRows: (sortsStatuses: Set<string | number>) => void;
  selectedRows: Set<string | number>;
  hiddenColumns: Set<string>;
  setHiddenColumns: (hiddenColumns: Set<string>) => void;
  setPage: (page: number) => void;
  count: number;
  rows?: UserDto[];
  page: number;
  perPage: number;
};

export default function UsersTable(props: UsersTableProps) {
  return (
    <Table<UserDto>
      sortStatuses={props.sorts}
      onSortChange={props.handleSortChange}
      selectable
      onSelectRows={props.setSelectedRows}
      selectedRows={props.selectedRows}
      hideableColumns
      hiddenColumns={props.hiddenColumns}
      setHiddenColumns={props.setHiddenColumns}
      onPageChange={props.setPage}
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
          strict: false,
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
          strict: false,
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
      rows={props.rows || []}
      count={props.count}
      currentPage={props.page}
      perPage={props.perPage}
    />
  );
}
