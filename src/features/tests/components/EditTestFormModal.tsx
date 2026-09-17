import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import InputPlus from "@/shared/components/custom/inputs/InputPlus";
import { useAppFormik } from "@/shared/lib/formik";
import { testFormSchema, type TestFormValues } from "../schemas/test-form.schema";
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

  const updateMutation = useUpdateTest({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
        toast.success("Test updated");
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
    validationZodSchema: testFormSchema,
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
      title={`Edit test — ${test?.name ?? ""}`}
      description="A test groups questions and a duration (minutes) shared by all of its test sessions."
    >
      <form
        className="flex flex-col gap-3 w-full sm:w-[440px]"
        onSubmit={formik.handleSubmit}
      >
        <InputPlus
          type="text"
          name="name"
          title="Name"
          value={formik.values.name}
          helperText={formik.touchedErrors.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <InputPlus
          type="number"
          name="period"
          title="Duration (minutes)"
          value={formik.values.period}
          helperText={formik.touchedErrors.period}
          onChange={formik.handleChange}
        />
        <InputPlus<SubjectDto, true>
          type="selectApi"
          title="Subjects"
          name="subjects"
          multiple
          value={formik.values.subjects}
          isItemEqualToValue={(item, value) => item.id === value.id}
          getInputLabel={(items) =>
            items?.length
              ? items.map((subject) => subject.name).join(", ")
              : "Select subjects..."
          }
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
        </InputPlus>

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
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Popup>
  );
}