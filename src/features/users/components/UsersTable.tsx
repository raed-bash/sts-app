import { NameCell } from "@/shared/components/custom/table/components/NameCell";
import { mutedIfDeleted } from "@/shared/components/custom/table/utils/muted-if-deleted";
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
      getCell: (username, row) => (
        <NameCell text={username} deletedAt={row.deletedAt} />
      ),
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
      truncate: true,
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
      hidden: true,
      getCell: (updatedAt) => dateFormatter(updatedAt),
      sort: true,
      strict: false,
    },
    {
      name: "deletedAt",
      headerName: "common:table.deletedAt",
      hidden: true,
      getCell: (deletedAt) => dateFormatter(deletedAt),
      sort: true,
      strict: false,
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
      getRowClassName={mutedIfDeleted}
    />
  );
}
