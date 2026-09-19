import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import type { AnswerDto } from "../dtos/answer.dto";

export type AnswersTableProps = TableAdapterProps<AnswerDto> & {
  actions: TableAction<AnswerDto>[];
};

const columns: TableColumn<AnswerDto>[] = [
  {
    name: "id",
    headerName: "#",
    sort: true,
  },
  {
    name: "text",
    headerName: "Text",
    sort: true,
    filterable: true,
    filterProps: {
      type: "text",
    },
  },
  {
    name: "isCorrect",
    headerName: "Is Correct",
    getCell: (isCorrect) => (
      <span
        className={`px-2 py-1 text-xs font-medium text-white rounded-full ${
          isCorrect ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {isCorrect ? "Yes" : "No"}
      </span>
    ),
    sort: true,
  },
  {
    name: "order",
    headerName: "Order",
    sort: true,
  },
  {
    name: "correctIndex",
    headerName: "Correct Index",
    sort: true,
  },
  {
    name: "actions",
    headerName: "Actions",
    strict: false,
    type: "actions",
  },
];

export default function AnswersTable({
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
}: AnswersTableProps) {
  return (
    <Table<AnswerDto>
      data={{ columns, ...data }}
      actions={actions}
      sorting={sorting}
      selection={{ selectable: true, ...selection }}
      hiding={{ hideableColumns: true, ...hiding }}
      pinning={{ pinnableColumns: true, ...pinning }}
      pagination={pagination}
      ordering={ordering}
      filtering={filtering}
      csv={{ fileName: "answers" }}
      loading={loading}
    />
  );
}
