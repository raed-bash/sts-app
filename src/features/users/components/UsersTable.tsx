import Table, {
  type TableSortStatuses,
} from "@/shared/components/custom/table/Table";
import type { UserDto } from "../dtos/user.dto";
import { dateFormater } from "@/shared/utils";
import RoleBadge from "@/components/RoleBadge";
import StatusBadge from "@/components/StatusBadge";
import type {
  UseTableSelectedRows,
  UseTableSortChangeHandler,
} from "@/shared/components/custom/table/hooks/useTable";
import {
  useOrderedColumnsLocalStorage,
  useHiddenColumnsLocalStorage,
} from "@/hooks";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type {
  FilterCondition,
  FilterLogicalOperator,
} from "@/shared/components/custom/table/filter";
import type { SyntheticEventHandler } from "@/shared/utils";
import { STATUS_TITLES } from "@/constants/user-status";
import { ROLE_TITLES } from "@/constants/user-role";
import { SelectItem } from "@/shared/components/ui/select";

export type UsersTableProps = {
  onSortChange: UseTableSortChangeHandler<UserDto>;
  sorts: TableSortStatuses;
  onSelectRows: (selectedRows: Set<string | number>) => void;
  selectedRows: UseTableSelectedRows;
  onPageChange: (page: number) => void;
  count: number;
  page: number;
  perPage?: number;
  loading: boolean;
  scLoading: boolean;
  handleFiltersChange: SyntheticEventHandler;
  debounceFilters: Record<string, any>;
  rows?: UserDto[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  filters: FilterCondition[];
  onLogicalOperatorChange: (operator: FilterLogicalOperator) => void;
  logicalOperator: FilterLogicalOperator;
};

export default function UsersTable(props: UsersTableProps) {
  const { orderedColumns, setOrderedColumns } = useOrderedColumnsLocalStorage<
    keyof UserDto | (string & {})
  >("usersOrder", []);

  const { hiddenColumns, setHiddenColumns } = useHiddenColumnsLocalStorage(
    "usersHiddenColumns",
    new Set(),
  );

  return (
    <Table<UserDto>
      data={{
        columns: [
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
        ],
        rows: props.rows || [],
      }}
      sorting={{
        sortStatuses: props.sorts,
        onSortChange: props.onSortChange,
      }}
      selection={{
        selectable: true,
        onSelectRows: props.onSelectRows,
        selectedRows: props.selectedRows,
      }}
      hiding={{
        hideableColumns: true,
        hiddenColumns,
        onHiddenColumnsChange: setHiddenColumns,
      }}
      pagination={{
        currentPage: props.page,
        perPage: props.perPage,
        count: props.count,
        onPageChange: props.onPageChange,
      }}
      ordering={{
        orderedColumns,
        onOrderedColumnsChange: setOrderedColumns,
      }}
      filtering={{
        filters: props.filters,
        onFiltersChange: props.onFiltersChange,
        logicalOperator: props.logicalOperator,
        onLogicalOperatorChange: props.onLogicalOperatorChange,
      }}
      loading={{
        loading: props.loading,
        scLoading: props.scLoading,
      }}
    />
  );
}
