import { useQueryClient } from "@tanstack/react-query";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { useAppFormik } from "@/shared/lib/formik";
import { useCreateSubject } from "../api/create-subject.api";
import { subjectsQueryKeys } from "../subjects.api-keys";
import { CreateSubjectDto } from "../dtos/create-subject.dto";
import type { SubjectDto } from "../dtos/subject.dto";
import {
  subjectFormSchema,
  type SubjectFormValues,
} from "../schemas/subject-form.schema";

export type CreateSubjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: SubjectDto) => void;
};

export default function CreateSubjectFormModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSubjectFormModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useCreateSubject({
    mutationConfig: {
      onSuccess: (data) => {
        onClose();
        queryClient.invalidateQueries({ queryKey: subjectsQueryKeys.all });
        toast.success("Subject created");
        onSuccess?.(data);
      },
    },
  });

  const loading = createMutation.isPending;

  const formik = useAppFormik<SubjectFormValues>({
    initialValues: {
      name: "",
    },
    validationZodSchema: subjectFormSchema,
    onSubmit: (values) => createMutation.mutate(new CreateSubjectDto(values)),
  });

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Create subject">
      <form
        className="flex flex-col gap-3 w-full sm:w-[420px]"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField
          type="text"
          name="name"
          title="Name"
          value={formik.values.name}
          helperText={formik.touchedErrors.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
