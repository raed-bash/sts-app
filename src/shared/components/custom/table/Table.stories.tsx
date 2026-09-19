import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Meta } from "@storybook/react-vite";
import Table from "./Table";
import type { TableAction } from "./components/TableActionsCell";
import type { TableColumn, TableRowRecord, TableSortStatuses } from "./Table";
import type { FilterCondition, FilterLogicalOperator } from "./filter";

type DemoRow = TableRowRecord & {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

const demoColumns: TableColumn<DemoRow>[] = [
  {
    name: "name",
    headerName: "Name",
    sort: true,
    filterable: true,
    filterProps: { type: "text" },
  },
  {
    name: "email",
    headerName: "Email",
    sort: true,
    filterable: true,
    filterProps: { type: "text" },
  },
  {
    name: "role",
    headerName: "Role",
    filterable: true,
    filterProps: { type: "text" },
  },
  {
    name: "status",
    headerName: "Status",
    filterable: true,
    filterProps: { type: "text" },
    hidden: true,
  },
  {
    name: "createdAt",
    headerName: "Created",
    sort: true,
  },
  { name: "actions", headerName: "", type: "actions" },
];

const demoRows: DemoRow[] = [
  {
    id: 1,
    name: "Ahmed Ali",
    email: "ahmed.ali@mail.com",
    role: "Admin",
    status: "active",
    createdAt: "2026-01-12",
  },
  {
    id: 2,
    name: "Sara Hassan",
    email: "sara.h@mail.com",
    role: "Editor",
    status: "active",
    createdAt: "2026-02-03",
  },
  {
    id: 3,
    name: "Omar Khaled",
    email: "omar.k@mail.com",
    role: "Viewer",
    status: "invited",
    createdAt: "2026-03-18",
  },
  {
    id: 4,
    name: "Lina Fawzy",
    email: "lina.f@mail.com",
    role: "Editor",
    status: "active",
    createdAt: "2026-04-02",
  },
  {
    id: 5,
    name: "Youssef Samir",
    email: "youssef.s@mail.com",
    role: "Admin",
    status: "disabled",
    createdAt: "2026-04-21",
  },
  {
    id: 6,
    name: "Mona Adel",
    email: "mona.a@mail.com",
    role: "Viewer",
    status: "active",
    createdAt: "2026-05-09",
  },
  {
    id: 7,
    name: "Karim Nabil",
    email: "karim.n@mail.com",
    role: "Editor",
    status: "invited",
    createdAt: "2026-06-14",
  },
  {
    id: 8,
    name: "Nour Essam",
    email: "nour.e@mail.com",
    role: "Viewer",
    status: "active",
    createdAt: "2026-07-01",
  },
];

const demoActions: TableAction<DemoRow>[] = [
  {
    name: "edit",
    label: "Edit",
    icon: <Pencil className="h-4 w-4" />,
    onClick: () => undefined,
  },
  {
    name: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "outline",
    onClick: () => undefined,
  },
  {
    name: "add",
    label: "Add",
    icon: <Plus className="h-4 w-4" />,
    variant: "default",
    hidden: (row) => row.status !== "active",
    onClick: () => undefined,
  },
];

function DemoTable({ withPinning = false }: { withPinning?: boolean }) {
  const [selectedRows, setSelectedRows] = useState<
    Map<string | number, DemoRow>
  >(new Map());
  const [sortStatuses, setSortStatuses] = useState<TableSortStatuses>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(
    withPinning ? new Set(["status"]) : new Set(),
  );
  const [orderedColumns, setOrderedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [logicalOperator, setLogicalOperator] =
    useState<FilterLogicalOperator>("AND");

  return (
    <Table<DemoRow>
      data={{ rows: demoRows, columns: demoColumns }}
      actions={demoActions}
      selection={{
        selectable: true,
        selectedRows,
        onSelectRows: setSelectedRows,
      }}
      sorting={{
        sortStatuses,
        onSortChange: (name, status) =>
          setSortStatuses((prev) => ({ ...prev, [String(name)]: status })),
      }}
      hiding={{
        hideableColumns: true,
        hiddenColumns,
        onHiddenColumnsChange: setHiddenColumns,
      }}
      pinning={{
        pinnableColumns: true,
        pinnedColumns,
        onPinnedColumnsChange: setPinnedColumns,
      }}
      ordering={{ orderedColumns, onOrderedColumnsChange: setOrderedColumns }}
      filtering={{
        filters,
        onFiltersChange: setFilters,
        logicalOperator,
        onLogicalOperatorChange: setLogicalOperator,
      }}
      pagination={{
        currentPage: 1,
        count: demoRows.length,
        perPage: 10,
        onPageChange: () => undefined,
      }}
      csv={{ fileName: "demo-table" }}
      loading={{}}
    />
  );
}

const meta = {
  title: "Custom/Table/Table",
  component: Table,
  parameters: { layout: "fullscreen" },
  render: () => <DemoTable />,
} satisfies Meta;

export default meta;

export const Basic = {};

export const WithPinnedColumns = {
  render: () => <DemoTable withPinning />,
};
