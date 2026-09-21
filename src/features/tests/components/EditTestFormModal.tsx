import { useQueryClient } from "@tanstack/react-query";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { useAppFormik } from "@/shared/lib/formik";
import {
  testFormSchema,
  type TestFormValues,
} from "../schemas/test-form.schema";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/shared/components/ui/select";
import { getSubjects } from "@/features/subjects/api/get-subjects.api";
import { subjectsQueryKeys } from "@/features/subjects/subjects.api-keys";
import { useUpdateTest } from "../api/update-test.api";
import { testsQueryKeys } from "../tests.api-keys";
import { UpdateTestDto } from "../dtos/update-test.dto";
import type { TestDto } from "../dtos/test.dto";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";
import { useTranslation } from "react-i18next";

export type EditTestFormModalProps = {
  isOpen: boolean;
  test: TestDto;
  initialSelectedSubjects?: SubjectDto[];
  onClose: () => void;
};

export default function EditTestFormModal({
  isOpen,
  test,
  initialSelectedSubjects,
  onClose,
}: EditTestFormModalProps) {
  const queryClient = useQueryClient();

  const { t } = useTranslation(["common", "tests"]);

  const updateMutation = useUpdateTest({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
        toast.success(t("tests:toasts.updated"));
      },
    },
  });

  const loading = updateMutation.isPending;

  const formik = useAppFormik<TestFormValues>({
    initialValues: {
      name: test?.name ?? "",
      period: test?.period ?? 30,
      subjects: initialSelectedSubjects ?? [],
    },
    enableReinitialize: true,
    validationZodSchema: () => testFormSchema(t),
    onSubmit: (values) =>
      updateMutation.mutate({
        id: test.id,
        data: new UpdateTestDto(values),
      }),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("tests:modal.editTitle", { name: test?.name ?? "" })}
      description={t("tests:modal.description")}
    >
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField
          type="text"
          name="name"
          title={t("common:fields.name")}
          value={formik.values.name}
          helperText={formik.touchedErrors.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <LabeledField
          type="number"
          name="period"
          title={t("common:fields.duration")}
          value={formik.values.period}
          helperText={formik.touchedErrors.period}
          onChange={formik.handleChange}
        />
        <LabeledField<SubjectDto, true>
          type="selectApi"
          title={t("tests:modal.subjects")}
          name="subjects"
          multiple
          value={formik.values.subjects}
          isItemEqualToValue={(item, value) => item.id === value.id}
          getInputLabel={(items) =>
            items?.length
              ? items.map((subject) => subject.name).join(", ")
              : t("tests:modal.selectSubjects")
          }
          onChange={formik.handleChange}
          queryProps={{
            queryFn: getSubjects,
            queryKey: subjectsQueryKeys.infiniteList(),
          }}
        >
          {(data) => (
            <SelectGroup>
              <SelectLabel>{t("tests:modal.subjects")}</SelectLabel>
              {data?.pages.map((page) =>
                page.data.map((subject) => (
                  <SelectItem key={subject.id} value={subject}>
                    {subject.name}
                  </SelectItem>
                )),
              )}
            </SelectGroup>
          )}
        </LabeledField>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={onClose}
            disabled={loading}
          >
            {t("common:actions.cancel")}
          </Button>
          <Button type="submit" className="w-fit" disabled={loading}>
            {loading ? t("common:actions.saving") : t("common:actions.save")}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
