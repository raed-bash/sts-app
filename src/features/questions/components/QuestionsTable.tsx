import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { dateFormatter } from "@/shared/utils";
import { SelectItem } from "@/shared/components/ui/select";
import { QUESTION_TYPE_TITLES } from "@/constants/question-type";
import type { QuestionDto } from "../dtos/question.dto";

export type QuestionsTableProps = TableAdapterProps<QuestionDto> & {
  actions: TableAction<QuestionDto>[];
};

const columns: TableColumn<QuestionDto>[] = [
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
    name: "type",
    headerName: "Type",
    sort: true,
    filterable: true,
    filterProps: {
      type: "select",
      getInputLabel(value: keyof typeof QUESTION_TYPE_TITLES) {
        return QUESTION_TYPE_TITLES[value];
      },
      children: Object.entries(QUESTION_TYPE_TITLES).map(([value, label]) => (
        <SelectItem key={value} value={value}>
          {label}
        </SelectItem>
      )),
    },
  },
  {
    name: "points",
    headerName: "Points",
    sort: true,
  },
  {
    name: "createdAt",
    headerName: "Created at",
    getCell: (createdAt) => dateFormatter(createdAt),
    sort: true,
  },
  {
    name: "updatedAt",
    headerName: "Updated at",
    getCell: (updatedAt) => dateFormatter(updatedAt),
    sort: true,
    strict: false,
  },
  {
    name: "deletedAt",
    headerName: "Deleted at",
    getCell: (deletedAt) => dateFormatter(deletedAt),
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

export default function QuestionsTable({
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
}: QuestionsTableProps) {
  const defaultSelectionLabel = (row: QuestionDto) => row.text || `#${row.id}`;

  return (
    <Table<QuestionDto>
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
      csv={{ fileName: "questions" }}
      loading={loading}
    />
  );
}