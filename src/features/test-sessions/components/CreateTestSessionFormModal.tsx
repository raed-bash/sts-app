import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { useAppFormik } from "@/shared/lib/formik";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/shared/components/ui/select";
import { getTests } from "@/features/tests/api/get-tests.api";
import { QueryTestDto } from "@/features/tests/dtos/query-test.dto";
import { dateFormatter } from "@/shared/utils";
import { testsQueryKeys } from "@/features/tests/tests.api-keys";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import { getSubjects } from "@/features/subjects/api/get-subjects.api";
import { subjectsQueryKeys } from "@/features/subjects/subjects.api-keys";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";
import { useCreateTestSession } from "../api/create-test-session.api";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";
import { CreateTestSessionDto } from "../dtos/create-test-session.dto";
import {
  createTestSessionFormSchema,
  type CreateTestSessionFormValues,
} from "../schemas/test-session-form.schema";

export type CreateTestSessionFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateTestSessionFormModal({
  isOpen,
  onClose,
}: CreateTestSessionFormModalProps) {
  const { t } = useTranslation(["common", "testSessions"]);
  const queryClient = useQueryClient();

  const createMutation = useCreateTestSession({
    mutationConfig: {
      onSuccess: () => {
        formik.resetForm();
        onClose();
        queryClient.invalidateQueries({ queryKey: testSessionsQueryKeys.all });
        toast.success(t("testSessions:toasts.created"));
      },
    },
  });

  const loading = createMutation.isPending;

  const formik = useAppFormik<CreateTestSessionFormValues>({
    initialValues: {
      startAt: "",
      test: null,
      subject: null,
    },
    validationZodSchema: () => createTestSessionFormSchema(t),
    onSubmit: (values) =>
      createMutation.mutate(new CreateTestSessionDto(values)),
  });

  const subjectId = formik.values.subject?.id;
  const endPreview =
    formik.values.test && formik.values.startAt
      ? dateFormatter(
          new Date(
            new Date(formik.values.startAt).getTime() +
              formik.values.test.period * 60_000,
          ),
        )
      : null;

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("testSessions:modal.createTitle")}
      description={t("testSessions:modal.createDescription")}
    >
      <form
        className="flex flex-col gap-3 w-[440px] max-w-full"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField<SubjectDto>
          type="selectApi"
          title={t("testSessions:modal.subject")}
          name="subject"
          value={formik.values.subject}
          getInputLabel={(item) =>
            item?.name || t("testSessions:modal.selectSubject")
          }
          isItemEqualToValue={(item, value) => item.id === value.id}
          helperText={formik.touchedErrors.subject}
          onChange={(event) => {
            formik.handleChange(event);
            // tests depend on the subject
            formik.setFieldValue("test", null);
          }}
          queryProps={{
            queryFn: getSubjects,
            queryKey: subjectsQueryKeys.infiniteList(),
          }}
        >
          {(data) => (
            <SelectGroup>
              <SelectLabel>{t("testSessions:modal.subjects")}</SelectLabel>
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
        {subjectId ? (
          <LabeledField<TestDto>
            type="selectApi"
            title={t("testSessions:modal.test")}
            name="test"
            value={formik.values.test}
            getInputLabel={(item) =>
              item?.name || t("testSessions:modal.selectTest")
            }
            isItemEqualToValue={(item, value) => item.id === value.id}
            helperText={formik.touchedErrors.test}
            onChange={formik.handleChange}
            queryProps={{
              queryFn: (params, signal) =>
                getTests(
                  new QueryTestDto({ ...params, subjectIds: [subjectId!] }),
                  signal,
                ),
              queryKey: [
                ...testsQueryKeys.infiniteList(),
                "subject",
                subjectId,
              ],
            }}
          >
            {(data) => (
              <SelectGroup>
                <SelectLabel>{t("entities.tests")}</SelectLabel>
                {data?.pages.map((page) =>
                  page.data.map((test) => (
                    <SelectItem key={test.id} value={test}>
                      {test.name}
                    </SelectItem>
                  )),
                )}
              </SelectGroup>
            )}
          </LabeledField>
        ) : (
          <p className="text-xs text-muted-foreground">
            {t("testSessions:modal.pickSubjectFirst")}
          </p>
        )}
        <LabeledField
          type="datetime-local"
          name="startAt"
          title={t("testSessions:modal.startsAt")}
          value={formik.values.startAt}
          helperText={formik.touchedErrors.startAt}
          onChange={formik.handleChange}
        />
        {formik.values.test && (
          <div className="rounded-lg bg-secondary/60 p-3 text-sm">
            <div>
              {t("testSessions:modal.durationInfo", {
                count: formik.values.test.period,
              })}
            </div>
            {endPreview && (
              <div className="text-muted-foreground">
                {t("testSessions:modal.endsAtInfo", { time: endPreview })}
              </div>
            )}
          </div>
        )}

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
            {loading ? t("common:actions.saving") : t("common:actions.create")}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
