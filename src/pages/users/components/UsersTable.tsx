import Table, { type TableSortStatuses } from "src/components/table/Table";
import type { UserDto } from "../dtos/user.dto";
import Tooltip from "src/components/tooltip/Tooltip";
import { dateFormater } from "src/utils/dateFormater";
import RoleView from "src/components/RoleView";
import StatusView from "src/components/StatusView";
import EditIcon from "src/assets/icons/edit.svg?react";
import RemoveIcon from "src/assets/icons/remove.svg?react";
import type {
  UseTableUtilsSelectedRows,
  UseTableUtilsSortEventHandler,
} from "src/components/table/hooks/useTableUtils";
import useOrderedColumnsStore from "src/hooks/useOrderedColumnsStore";
import useHiddenColumnsLocalStorage from "src/hooks/useHiddenColumnsLocalStorage";

export type UsersTableProps = {
  handleSortChange: UseTableUtilsSortEventHandler<UserDto>;
  sorts: TableSortStatuses;
  setSelectedRows: (sortsStatuses: Set<string | number>) => void;
  selectedRows: UseTableUtilsSelectedRows;
  setPage: (page: number) => void;
  count: number;
  rows?: UserDto[];
  page: number;
  perPage: number;
  loading: boolean;
  scLoading: boolean;
};

export default function UsersTable(props: UsersTableProps) {
  const { orderedColumns, setOrderedColumns } = useOrderedColumnsStore<
    keyof UserDto | (string & {})
  >("usersOrder", []);

  const { hiddenColumns, setHiddenColumns } = useHiddenColumnsLocalStorage(
    "usersHiddenColumns",
    new Set()
  );

  return (
    <Table<UserDto>
      sortStatuses={props.sorts}
      onSortChange={props.handleSortChange}
      selectable
      onSelectRows={props.setSelectedRows}
      selectedRows={props.selectedRows}
      hideableColumns
      hiddenColumns={hiddenColumns}
      setHiddenColumns={setHiddenColumns}
      onPageChange={props.setPage}
      orderedColumns={orderedColumns}
      setOrderedColumns={setOrderedColumns}
      columns={[
        {
          name: "id",
          headerName: "#",
          sort: true,
        },
        {
          name: "username",
          headerName: "Username",
          sort: true,
        },
        {
          name: "fullName",
          headerName: "Full Name",
          strict: false,
          getCell: (_, row) => row.student?.fullName || row.teacher?.fullName,
        },
        {
          name: "status",
          headerName: "Status",
          getCell: (status) => <StatusView status={status} />,
          sort: true,
        },
        {
          name: "role",
          headerName: "Role",
          getCell: (role) => <RoleView role={role} />,
          sort: true,
        },
        {
          name: "createdAt",
          headerName: "Created at",
          getCell: (createdAt) => dateFormater(createdAt),
          sort: true,
        },
        {
          name: "updatedAt",
          headerName: "Updated at",
          getCell: (updatedAt) => dateFormater(updatedAt),
          sort: true,
          strict: false,
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
      loading={props.loading}
      scLoading={props.scLoading}
    />
  );
}
