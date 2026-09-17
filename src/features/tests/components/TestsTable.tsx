import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { dateFormater } from "@/shared/utils";
import type { TestDto } from "../dtos/test.dto";

export type TestsTableProps = TableAdapterProps<TestDto> & {
  actions: TableAction<TestDto>[];
};

const columns: TableColumn<TestDto>[] = [
  {
    name: "id",
    headerName: "#",
    sort: true,
  },
  {
    name: "name",
    headerName: "Name",
    sort: true,
    filterable: true,
    filterProps: {
      type: "text",
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
      loading={loading}
    />
  );
}