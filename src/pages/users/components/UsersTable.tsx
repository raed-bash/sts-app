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
import { useState } from "react";
import type { FilterItem } from "@/shared/components/custom/table/filter";
import type { SyntheticEventHandler } from "@/shared/utils";

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
};

export default function UsersTable(props: UsersTableProps) {
  const { orderedColumns, setOrderedColumns } = useOrderedColumnsLocalStorage<
    keyof UserDto | (string & {})
  >("usersOrder", []);

  const { hiddenColumns, setHiddenColumns } = useHiddeneColumnsLocalStorage(
    "usersHiddenColumns",
    new Set(),
  );

  const [filters, setFilters] = useState<FilterItem[]>([]);

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
      filters={filters}
      setFilters={setFilters}
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
          filterable: true,
          filterProps: {
            type: "text",
          },
        },
        {
          name: "status",
          headerName: "Status",
          getCell: (status) => <StatusBadge status={status} />,
          sort: true,
          filterable: true,
          filterProps: {
            type: "text",
          },
        },
        {
          name: "role",
          headerName: "Role",
          getCell: (role) => <RoleBadge role={role} />,
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
