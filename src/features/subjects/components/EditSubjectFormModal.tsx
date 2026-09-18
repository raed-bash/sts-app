import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { useAppFormik } from "@/shared/lib/formik";
import { useUpdateSubject } from "../api/update-subject.api";
import { subjectsQueryKeys } from "../subjects.api-keys";
import { UpdateSubjectDto } from "../dtos/update-subject.dto";
import type { SubjectDto } from "../dtos/subject.dto";
import {
  subjectFormSchema,
  type SubjectFormValues,
} from "../schemas/subject-form.schema";

export type EditSubjectFormModalProps = {
  isOpen: boolean;
  subject: SubjectDto;
  onClose: () => void;
};

export default function EditSubjectFormModal({
  isOpen,
  subject,
  onClose,
}: EditSubjectFormModalProps) {
  const queryClient = useQueryClient();

  const updateMutation = useUpdateSubject({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: subjectsQueryKeys.all });
        toast.success("Subject updated");
      },
    },
  });

  const loading = updateMutation.isPending;

  const formik = useAppFormik<SubjectFormValues>({
    initialValues: {
      name: subject.name,
    },
    enableReinitialize: true,
    validationZodSchema: subjectFormSchema,
    onSubmit: (values) =>
      updateMutation.mutate({
        id: subject.id,
        data: new UpdateSubjectDto(subject.id, values),
      }),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit subject — ${subject.name ?? ""}`}
    >
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
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
