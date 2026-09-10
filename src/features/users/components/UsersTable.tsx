import * as React from "react";
import Table, {
  type TableSortStatuses,
} from "@/shared/components/custom/table/Table";
import type { UserDto } from "../dtos/user.dto";
import { dateFormater } from "@/shared/utils";
import RoleBadge from "@/components/RoleBadge";
import StatusBadge from "@/components/StatusBadge";
import type {
  UseTableSelectedRows,
  UseTableSortChangeEventAction,
} from "@/shared/components/custom/table/hooks/useTable";
import {
  useOrderedColumnsLocalStorage,
  useHiddeneColumnsLocalStorage,
} from "@/hooks";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { FilterItem } from "@/shared/components/custom/table/filter";
import type { SyntheticEventHandler } from "@/shared/utils";
import { STATUS_TITLES } from "@/constants/user-status";
import { ROLE_TITLES } from "@/constants/user-role";
import { SelectItem } from "@/shared/components/ui/select";

export type UsersTableProps = {
  onSortChange: UseTableSortChangeEventAction<UserDto>;
  sorts: TableSortStatuses;
  setSelectedRows: (sortsStatuses: Set<string | number>) => void;
  selectedRows: UseTableSelectedRows;
  setPage: (page: number) => void;
  count: number;
  page: number;
  perPage?: number;
  loading: boolean;
  scLoading: boolean;
  handleFiltersChange: SyntheticEventHandler;
  debounceFilters: Record<string, any>;
  rows?: UserDto[];
  setFilters: React.Dispatch<React.SetStateAction<FilterItem[]>>;
  filters: FilterItem[];
};

export default function UsersTable(props: UsersTableProps) {
  const { orderedColumns, setOrderedColumns } = useOrderedColumnsLocalStorage<
    keyof UserDto | (string & {})
  >("usersOrder", []);

  const { hiddenColumns, setHiddenColumns } = useHiddeneColumnsLocalStorage(
    "usersHiddenColumns",
    new Set(),
  );

  return (
    <Table<UserDto>
      sortStatuses={props.sorts}
      onSortChange={props.onSortChange}
      selectable
      onSelectRows={props.setSelectedRows}
      selectedRows={props.selectedRows}
      hideableColumns
      hiddenColumns={hiddenColumns}
      setHiddenColumns={setHiddenColumns}
      onPageChange={props.setPage}
      orderedColumns={orderedColumns}
      setOrderedColumns={setOrderedColumns}
      filters={props.filters}
      setFilters={props.setFilters}
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
          filterable: true,
          filterProps: {
            type: "text",
          },
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
          getCell: (status) => <StatusBadge status={status} />,
          sort: true,
          filterable: true,
          filterProps: {
            type: "select",
            getInputLabel(value: keyof typeof STATUS_TITLES) {
              return STATUS_TITLES[value];
            },
            children: Object.entries(STATUS_TITLES).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            )),
          },
        },
        {
          name: "role",
          headerName: "Role",
          getCell: (role) => <RoleBadge role={role} />,
          sort: true,
          filterable: true,
          filterProps: {
            type: "select",
            getInputLabel: (value: keyof typeof ROLE_TITLES) =>
              ROLE_TITLES[value],
            children: Object.entries(ROLE_TITLES).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            )),
          },
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
          name: "deletedAt",
          headerName: "Deleted at",
          getCell: (deletedAt) => dateFormater(deletedAt),
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
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button variant="outline">
                        <Edit />
                      </Button>
                    }
                  />
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button variant="destructive">
                        <Trash />
                      </Button>
                    }
                  />

                  <TooltipContent>Remove</TooltipContent>
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
