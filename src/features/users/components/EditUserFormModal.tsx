import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { SelectItem } from "@/shared/components/ui/select";
import { useAppFormik } from "@/shared/lib/formik";
import { useUpdateUser } from "../api/update-user.api";
import { usersQueryKeys } from "../users.api-keys";
import { UpdateUserDto } from "../dtos/update-user.dto";
import type { UserDto } from "../dtos/user.dto";
import { ROLE_TITLES, type UserRole } from "@/constants/user-role";
import { STATUS_TITLES, type UserStatus } from "@/constants/user-status";
import {
  editUserFormSchema,
  type EditUserFormValues,
} from "../schemas/user-form.schema";

export type EditUserFormModalProps = {
  isOpen: boolean;
  user: UserDto;
  onClose: () => void;
};

export default function EditUserFormModal({
  isOpen,
  user,
  onClose,
}: EditUserFormModalProps) {
  const queryClient = useQueryClient();

  const updateMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
        toast.success("User updated");
      },
    },
  });

  const loading = updateMutation.isPending;

  const formik = useAppFormik<EditUserFormValues>({
    initialValues: {
      username: user.username,
      role: user.role,
      status: user.status,
    },
    enableReinitialize: true,
    validationZodSchema: editUserFormSchema,
    onSubmit: (values) =>
      updateMutation.mutate({
        id: user.id,
        data: new UpdateUserDto(user.id, values),
      }),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit user — ${user?.username ?? ""}`}
    >
      <form
        className="flex flex-col gap-3 w-full sm:w-[420px]"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField
          type="text"
          name="username"
          title="Username"
          value={formik.values.username}
          helperText={formik.touchedErrors.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <LabeledField
          type="select"
          name="role"
          title="Role"
          value={formik.values.role}
          onChange={formik.handleChange}
          getInputLabel={(value) =>
            value ? ROLE_TITLES[value as UserRole] : "Select role"
          }
        >
          {(Object.keys(ROLE_TITLES) as UserRole[]).map((role) => (
            <SelectItem key={role} value={role}>
              {ROLE_TITLES[role]}
            </SelectItem>
          ))}
        </LabeledField>
        <LabeledField
          type="select"
          name="status"
          title="Status"
          value={formik.values.status}
          onChange={formik.handleChange}
          getInputLabel={(value) =>
            value ? STATUS_TITLES[value as UserStatus] : "Select status"
          }
        >
          {(Object.keys(STATUS_TITLES) as UserStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_TITLES[status]}
            </SelectItem>
          ))}
        </LabeledField>

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
