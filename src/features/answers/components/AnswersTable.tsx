import { Check, X } from "lucide-react";
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
      truncate: true,
      sort: true,
      filterable: true,
      filterProps: {
        type: "text",
      },
    },
    {
      name: "isCorrect",
      headerName: "answers:table.isCorrect",
      // blanks/order answers are judged by position, not by isCorrect
      getCell: (isCorrect, row) =>
        row.correctIndex != null ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {t("answers:table.position", { n: row.correctIndex })}
          </span>
        ) : isCorrect ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
            <Check size={12} />
            {t("answers:table.correct")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            <X size={12} />
            {t("answers:table.incorrect")}
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
      hidden: true,
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
