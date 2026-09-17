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
import { useCreateTest } from "../api/create-test.api";
import { testsQueryKeys } from "../tests.api-keys";
import { CreateTestDto } from "../dtos/create-test.dto";
import type { TestDto } from "../dtos/test.dto";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";

export type CreateTestFormModalProps = {
  isOpen: boolean;
  initialSelectedSubjects?: SubjectDto[];
  onClose: () => void;
  onSuccess?: (data: TestDto) => void;
};

export default function CreateTestFormModal({
  isOpen,
  initialSelectedSubjects,
  onClose,
  onSuccess,
}: CreateTestFormModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useCreateTest({
    mutationConfig: {
      onSuccess: (data) => {
        onClose();
        queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
        toast.success("Test created");
        onSuccess?.(data);
      },
    },
  });

  const loading = createMutation.isPending;

  const formik = useAppFormik<TestFormValues>({
    initialValues: {
      name: "",
      period: 30,
      subjects: initialSelectedSubjects ?? [],
    },
    validationZodSchema: testFormSchema,
    onSubmit: (values) => createMutation.mutate(new CreateTestDto(values)),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title="Create test"
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
            {loading ? "Saving..." : "Create"}
          </Button>
        </div>
      </form>
    </Popup>
  );
}