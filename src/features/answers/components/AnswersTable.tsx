import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { useTranslation } from "react-i18next";
import type { AnswerDto } from "../dtos/answer.dto";

export type AnswersTableProps = TableAdapterProps<AnswerDto> & {
  actions: TableAction<AnswerDto>[];
};

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
  const { t } = useTranslation(["answers", "common"]);

  const columns: TableColumn<AnswerDto>[] = [
    {
      name: "id",
      headerName: "common:table.id",
      sort: true,
    },
    {
      name: "text",
      headerName: "common:fields.text",
      sort: true,
      filterable: true,
      filterProps: {
        type: "text",
      },
    },
    {
      name: "isCorrect",
      headerName: "answers:table.isCorrect",
      getCell: (isCorrect) => (
        <span
          className={`px-2 py-1 text-xs font-medium text-white rounded-full ${
            isCorrect ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isCorrect ? t("common:actions.yes") : t("common:actions.no")}
        </span>
      ),
      sort: true,
    },
    {
      name: "order",
      headerName: "common:fields.order",
      sort: true,
    },
    {
      name: "correctIndex",
      headerName: "answers:table.correctIndex",
      sort: true,
    },
    {
      name: "actions",
      headerName: "common:table.actions",
      strict: false,
      type: "actions",
    },
  ];

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
