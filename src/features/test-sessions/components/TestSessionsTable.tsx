import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { dateFormater } from "@/shared/utils";
import TestSessionStatusBadge from "@/components/TestSessionStatusBadge";
import { SelectItem } from "@/shared/components/ui/select";
import { TEST_SESSION_STATUS_TITLES } from "@/constants/test-session-status";
import type { TestSessionDto } from "../dtos/test-session.dto";

export type TestSessionsTableProps = TableAdapterProps<TestSessionDto> & {
  actions: TableAction<TestSessionDto>[];
};

const columns: TableColumn<TestSessionDto>[] = [
  {
    name: "id",
    headerName: "#",
    sort: true,
  },
  {
    name: "test",
    headerName: "Test",
    strict: false,
    getCell: (_, row) => row.test?.name,
  },
  {
    name: "status",
    headerName: "Status",
    getCell: (status) => <TestSessionStatusBadge status={status} />,
    sort: true,
    filterable: true,
    filterProps: {
      type: "select",
      getInputLabel(value: keyof typeof TEST_SESSION_STATUS_TITLES) {
        return TEST_SESSION_STATUS_TITLES[value];
      },
      children: Object.entries(TEST_SESSION_STATUS_TITLES).map(
        ([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ),
      ),
    },
  },
  {
    name: "startDate",
    headerName: "Start date",
    getCell: (startDate) => dateFormater(startDate),
    sort: true,
  },
  {
    name: "finishDate",
    headerName: "Finish date",
    getCell: (finishDate) => dateFormater(finishDate),
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
    type: "actions",
  },
];

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