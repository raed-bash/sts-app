import Table, { type TableSortStatuses } from "src/components/table/Table";
import type { UserDto } from "../dtos/user.dto";
import { dateFormater } from "src/utils/dateFormater";
import RoleView from "src/components/RoleView";
import StatusView from "src/components/StatusView";
import type {
  UseTableUtilsSelectedRows,
  UseTableUtilsSortEventHandler,
} from "src/components/table/hooks/useTableUtils";
import useOrderedColumnsStore from "src/hooks/useOrderedColumnsStore";
import useHiddenColumnsLocalStorage from "src/hooks/useHiddenColumnsLocalStorage";
import type { EventTarget } from "src/utils/EventTarget";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import type { FilterItem } from "@/components/table/filter";

export type UsersTableProps = {
  handleSortChange: UseTableUtilsSortEventHandler<UserDto>;
  sorts: TableSortStatuses;
  setSelectedRows: (sortsStatuses: Set<string | number>) => void;
  selectedRows: UseTableUtilsSelectedRows;
  setPage: (page: number) => void;
  count: number;
  page: number;
  perPage?: number;
  loading: boolean;
  scLoading: boolean;
  handleFiltersDebounceChange: (value: EventTarget) => void;
  filtersDebounce: Record<string, any>;
  rows?: UserDto[];
};

export default function UsersTable(props: UsersTableProps) {
  const { orderedColumns, setOrderedColumns } = useOrderedColumnsStore<
    keyof UserDto | (string & {})
  >("usersOrder", []);

  const { hiddenColumns, setHiddenColumns } = useHiddenColumnsLocalStorage(
    "usersHiddenColumns",
    new Set(),
  );

  const [filters, setFilters] = useState<FilterItem[]>([]);

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
          getCell: (status) => <StatusView status={status} />,
          sort: true,
          filterable: true,
          filterProps: {
            type: "text",
          },
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
