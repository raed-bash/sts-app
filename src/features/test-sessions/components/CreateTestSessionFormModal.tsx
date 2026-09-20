import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const createMutation = useCreateTestSession({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: testSessionsQueryKeys.all });
        toast.success("Test session created");
      },
    },
  });

  const loading = createMutation.isPending;

  const formik = useAppFormik<CreateTestSessionFormValues>({
    initialValues: {
      startAt: "",
      period: 30,
      test: null,
      subject: null,
    },
    validationZodSchema: createTestSessionFormSchema,
    onSubmit: (values) =>
      createMutation.mutate(new CreateTestSessionDto(values)),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title="Create test session"
      description="Pick a test, the subject it covers and when it starts."
    >
      <form
        className="flex flex-col gap-3 w-[440px] max-w-full"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField<TestDto>
          type="selectApi"
          title="Test"
          name="test"
          value={formik.values.test}
          getInputLabel={(item) => item?.name || "Select test..."}
          isItemEqualToValue={(item, value) => item.id === value.id}
          onChange={formik.handleChange}
          queryProps={{
            queryFn: getTests,
            queryKey: testsQueryKeys.infiniteList(),
          }}
        >
          {(data) => (
            <SelectGroup>
              <SelectLabel>Tests</SelectLabel>
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
        <LabeledField<SubjectDto>
          type="selectApi"
          title="Subject"
          name="subject"
          value={formik.values.subject}
          getInputLabel={(item) => item?.name || "Select subject..."}
          isItemEqualToValue={(item, value) => item.id === value.id}
          onChange={formik.handleChange}
          queryProps={{
            queryFn: getSubjects,
            queryKey: subjectsQueryKeys.infiniteList(),
          }}
        >
          {(data) => (
            <SelectGroup>
              <SelectLabel>Subjects</SelectLabel>
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
        <LabeledField
          type="datetime-local"
          name="startAt"
          title="Starts at"
          value={formik.values.startAt}
          helperText={formik.touchedErrors.startAt}
          onChange={formik.handleChange}
        />
        <LabeledField
          type="number"
          name="period"
          title="Duration (minutes)"
          value={formik.values.period}
          helperText={formik.touchedErrors.period}
          onChange={formik.handleChange}
        />

        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-fit" disabled={loading}>
            {loading ? "Saving..." : "Create"}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
