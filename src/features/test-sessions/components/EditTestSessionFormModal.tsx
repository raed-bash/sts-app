import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { useAppFormik } from "@/shared/lib/formik";
import { useUpdateTestSession } from "../api/update-test-session.api";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";
import { UpdateTestSessionDto } from "../dtos/update-test-session.dto";
import type { TestSessionDto } from "../dtos/test-session.dto";
import {
  editTestSessionFormSchema,
  type EditTestSessionFormValues,
} from "../schemas/test-session-form.schema";

export type EditTestSessionFormModalProps = {
  isOpen: boolean;
  session: TestSessionDto;
  onClose: () => void;
};

export default function EditTestSessionFormModal({
  isOpen,
  session,
  onClose,
}: EditTestSessionFormModalProps) {
  const queryClient = useQueryClient();

  const updateMutation = useUpdateTestSession({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: testSessionsQueryKeys.all });
        toast.success("Test session updated");
      },
    },
  });

  const loading = updateMutation.isPending;

  const toLocalValue = (date: Date | string | undefined) => {
    if (!date) return "";

    const d = new Date(date);

    const pad = (n: number) => String(n).padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const formik = useAppFormik<EditTestSessionFormValues>({
    initialValues: {
      startAt: toLocalValue(session?.startDate),
      endAt: toLocalValue(session?.finishDate),
    },
    enableReinitialize: true,
    validationZodSchema: editTestSessionFormSchema,
    onSubmit: (values) => {
      updateMutation.mutate({
        id: session.id,
        data: new UpdateTestSessionDto(session.id, values),
      });
    },
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit session #${session?.id ?? ""}`}
      description="Update the session schedule."
    >
      <form
        className="flex flex-col gap-3 w-[440px] max-w-full"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid grid-cols-2 gap-3">
          <LabeledField
            type="datetime-local"
            name="startAt"
            title="Starts at"
            value={formik.values.startAt}
            helperText={formik.touchedErrors.startAt}
            onChange={formik.handleChange}
          />
          <LabeledField
            type="datetime-local"
            name="endAt"
            title="Ends at"
            value={formik.values.endAt}
            helperText={formik.touchedErrors.endAt}
            onChange={formik.handleChange}
          />
        </div>

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
