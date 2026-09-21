import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { dateFormatter } from "@/shared/utils";
import type { TestDto } from "../dtos/test.dto";

export type TestsTableProps = TableAdapterProps<TestDto> & {
  actions: TableAction<TestDto>[];
};

const columns: TableColumn<TestDto>[] = [
  {
    name: "id",
    headerName: "common:table.id",
    sort: true,
  },
  {
    name: "name",
    headerName: "common:table.name",
    sort: true,
    filterable: true,
    filterProps: {
      type: "text",
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
    name: "actions",
    headerName: "common:table.actions",
    strict: false,
    type: "actions",
  },
];

export default function TestsTable({
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
}: TestsTableProps) {
  const defaultSelectionLabel = (row: TestDto) => row.name || `#${row.id}`;

  return (
    <Table<TestDto>
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
      csv={{ fileName: "tests" }}
      loading={loading}
    />
  );
}
