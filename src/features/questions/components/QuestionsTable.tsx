import Table, {
  type TableColumn,
} from "@/shared/components/custom/table/Table";
import type { TableAdapterProps } from "@/shared/components/custom/table/TableAdapter";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { dateFormatter } from "@/shared/utils";
import { SelectItem } from "@/shared/components/ui/select";
import { QUESTION_TYPE_TITLES } from "@/constants/question-type";
import { useTranslation } from "react-i18next";
import { translateDynamic } from "@/shared/lib/translate-dynamic";
import type { QuestionDto, QuestionType } from "../dtos/question.dto";

export type QuestionsTableProps = TableAdapterProps<QuestionDto> & {
  actions: TableAction<QuestionDto>[];
};

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
  const { t } = useTranslation(["questions", "common"]);

  const defaultSelectionLabel = (row: QuestionDto) => row.text || `#${row.id}`;

  const columns: TableColumn<QuestionDto>[] = [
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
      name: "type",
      headerName: "common:fields.type",
      sort: true,
      filterable: true,
      filterProps: {
        type: "select",
        getInputLabel(value) {
          return value
            ? t(QUESTION_TYPE_TITLES[value as QuestionType])
            : t("questions:modal.selectType");
        },
        children: (
          Object.entries(QUESTION_TYPE_TITLES) as [QuestionType, string][]
        ).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {translateDynamic(t, label)}
          </SelectItem>
        )),
      },
    },
    {
      name: "points",
      headerName: "common:fields.points",
      sort: true,
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
