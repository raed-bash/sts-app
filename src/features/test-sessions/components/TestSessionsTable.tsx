import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { dateFormatter } from "@/shared/utils";
import { useTranslation } from "react-i18next";
import TestSessionStatusBadge from "@/components/TestSessionStatusBadge";
import { SelectItem } from "@/shared/components/ui/select";
import { TEST_SESSION_STATUS_TITLES } from "@/constants/test-session-status";
import type { TestSessionDto } from "../dtos/test-session.dto";

export type TestSessionsTableProps = TableAdapterProps<TestSessionDto> & {
  actions: TableAction<TestSessionDto>[];
};

export default function TestSessionsTable({
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
}: TestSessionsTableProps) {
  const { t } = useTranslation(["testSessions", "common"]);

  const columns: TableColumn<TestSessionDto>[] = [
    {
      name: "id",
      headerName: t("common:table.id"),
      sort: true,
    },
    {
      name: "test",
      headerName: t("testSessions:table.test"),
      strict: false,
      getCell: (_, row) => row.test?.name,
    },
    {
      name: "status",
      headerName: t("common:table.status"),
      getCell: (status) => <TestSessionStatusBadge status={status} />,
      sort: true,
      filterable: true,
      filterProps: {
        type: "select",
        getInputLabel(value: keyof typeof TEST_SESSION_STATUS_TITLES) {
          return t(TEST_SESSION_STATUS_TITLES[value]);
        },
        children: Object.entries(TEST_SESSION_STATUS_TITLES).map(
          ([value, label]) => (
            <SelectItem key={value} value={value}>
              {t(label)}
            </SelectItem>
          ),
        ),
      },
    },
    {
      name: "startDate",
      headerName: t("testSessions:table.startDate"),
      getCell: (startDate) => dateFormatter(startDate),
      sort: true,
    },
    {
      name: "finishDate",
      headerName: t("testSessions:table.finishDate"),
      getCell: (finishDate) => dateFormatter(finishDate),
      sort: true,
    },
    {
      name: "updatedAt",
      headerName: t("testSessions:table.updatedAt"),
      getCell: (updatedAt) => dateFormatter(updatedAt),
      sort: true,
      strict: false,
    },
    {
      name: "actions",
      headerName: t("common:table.actions"),
      strict: false,
      type: "actions",
    },
  ];

  return (
    <Table<TestSessionDto>
      data={{ columns, ...data }}
      actions={actions}
      sorting={sorting}
      selection={{
        selectable: true,
        ...selection,
        getSelectionLabel: selection.getSelectionLabel,
      }}
      hiding={{ hideableColumns: true, ...hiding }}
      pinning={{ pinnableColumns: true, ...pinning }}
      pagination={pagination}
      ordering={ordering}
      filtering={filtering}
      csv={{ fileName: "test-sessions" }}
      loading={loading}
    />
  );
}
