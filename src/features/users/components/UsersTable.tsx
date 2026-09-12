import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { dateFormater } from "@/shared/utils";
import RoleBadge from "@/components/RoleBadge";
import StatusBadge from "@/components/StatusBadge";
import { SelectItem } from "@/shared/components/ui/select";
import { ROLE_TITLES } from "@/constants/user-role";
import { STATUS_TITLES } from "@/constants/user-status";
import type { UserDto } from "../dtos/user.dto";

export type UsersTableProps = TableAdapterProps<UserDto> & {
  actions: TableAction<UserDto>[];
};

const columns: TableColumn<UserDto>[] = [
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
      getInputLabel(value: keyof typeof ROLE_TITLES) {
        return ROLE_TITLES[value];
      },
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
    type: "actions",
  },
];

export default function UsersTable({
  data,
  pagination,
  sorting,
  selection,
  hiding,
  ordering,
  filtering,
  loading,
  actions,
}: UsersTableProps) {
  return (
    <Table<UserDto>
      data={{ columns, ...data }}
      actions={actions}
      sorting={sorting}
      selection={{ selectable: true, ...selection }}
      hiding={{ hideableColumns: true, ...hiding }}
      pagination={pagination}
      ordering={ordering}
      filtering={filtering}
      loading={loading}
    />
  );
}
