import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { dateFormatter } from "@/shared/utils";
import RoleBadge from "@/components/RoleBadge";
import StatusBadge from "@/components/StatusBadge";
import { SelectItem } from "@/shared/components/ui/select";
import { ROLE_TITLES, type UserRole } from "@/constants/user-role";
import { STATUS_TITLES, type UserStatus } from "@/constants/user-status";
import { useTranslation } from "react-i18next";
import { translateDynamic } from "@/shared/lib/translate-dynamic";
import type { UserDto } from "../dtos/user.dto";

export type UsersTableProps = TableAdapterProps<UserDto> & {
  actions: TableAction<UserDto>[];
};

export default function UsersTable({
  data,
  pagination,
  sorting,
  selection,
  hiding,
  pinning,
  ordering,
  filtering,
  loading,
  actions,
}: UsersTableProps) {
  const { t } = useTranslation(["users", "common"]);

  const defaultSelectionLabel = (row: UserDto) =>
    row.student?.fullName ||
    row.teacher?.fullName ||
    row.username ||
    `#${row.id}`;

  const columns: TableColumn<UserDto>[] = [
    {
      name: "id",
      headerName: "common:table.id",
      sort: true,
    },
    {
      name: "username",
      headerName: "common:fields.username",
      sort: true,
      filterable: true,
      filterProps: {
        type: "text",
      },
    },
    {
      name: "fullName",
      headerName: "common:fields.fullName",
      strict: false,
      getCell: (_, row) => row.student?.fullName || row.teacher?.fullName,
    },
    {
      name: "status",
      headerName: "common:fields.status",
      getCell: (status) => <StatusBadge status={status} />,
      sort: true,
      filterable: true,
      filterProps: {
        type: "select",
        getInputLabel(value) {
          return value
            ? t(STATUS_TITLES[value as UserStatus])
            : t("users:modal.selectStatus");
        },
        children: (Object.entries(STATUS_TITLES) as [UserStatus, string][]).map(
          ([value, label]) => (
            <SelectItem key={value} value={value}>
              {translateDynamic(t, label)}
            </SelectItem>
          ),
        ),
      },
    },
    {
      name: "role",
      headerName: "common:fields.role",
      getCell: (role) => <RoleBadge role={role} />,
      sort: true,
      filterable: true,
      filterProps: {
        type: "select",
        getInputLabel(value) {
          return value
            ? t(ROLE_TITLES[value as UserRole])
            : t("users:modal.selectRole");
        },
        children: (Object.entries(ROLE_TITLES) as [UserRole, string][]).map(
          ([value, label]) => (
            <SelectItem key={value} value={value}>
              {translateDynamic(t, label)}
            </SelectItem>
          ),
        ),
      },
    },
    {
      name: "createdAt",
      headerName: "common:table.createdAt",
      getCell: (createdAt) => dateFormatter(createdAt),
      sort: true,
    },
    {
      name: "updatedAt",
      headerName: "common:table.updatedAt",
      getCell: (updatedAt) => dateFormatter(updatedAt),
      sort: true,
      strict: false,
    },
    {
      name: "deletedAt",
      headerName: "common:table.deletedAt",
      getCell: (deletedAt) => dateFormatter(deletedAt),
      sort: true,
      strict: false,
    },
    {
      name: "fakePhone",
      headerName: "users:table.phone",
      strict: false,
      getCell: (_, row) =>
        `+20 1${(row.id % 1000).toString().padStart(3, "0")} ${(row.id * 7)
          .toString()
          .padStart(4, "0")}`,
    },
    {
      name: "fakeEmail",
      headerName: "common:fields.email",
      strict: false,
      getCell: (_, row) =>
        `${(row.student?.fullName || row.teacher?.fullName || row.username)
          .toLowerCase()
          .replace(/\s+/g, ".")}@example.com`,
    },
    {
      name: "fakeAddress",
      headerName: "users:table.address",
      strict: false,
      getCell: (_, row) =>
        `${(row.id * 13) % 500} Main Street, District ${(row.id * 3) % 12}, Cairo, Egypt - floor ${(row.id * 5) % 7}`,
    },
    {
      name: "fakeCompany",
      headerName: "users:table.company",
      strict: false,
      getCell: (_, row) =>
        `Tech Solutions #${(row.id % 15) + 1} - Department ${(row.id % 6) + 1}`,
    },
    {
      name: "fakeScore",
      headerName: "common:fields.score",
      strict: false,
      getCell: (_, row) => `${(row.id * 37) % 100} pts`,
    },
    {
      name: "actions",
      headerName: "common:table.actions",
      strict: false,
      type: "actions",
    },
  ];

  return (
    <Table<UserDto>
      data={{ columns, ...data }}
      actions={actions}
      sorting={sorting}
      selection={{
        selectable: true,
        ...selection,
        getSelectionLabel: selection.getSelectionLabel ?? defaultSelectionLabel,
      }}
      hiding={{ hideableColumns: true, ...hiding }}
      pinning={{ pinnableColumns: true, ...pinning }}
      pagination={pagination}
      ordering={ordering}
      filtering={filtering}
      csv={{ fileName: "users" }}
      loading={loading}
    />
  );
}
