import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { useAppFormik } from "@/shared/lib/formik";
import { useChangeUserPassword } from "../api/change-user-password.api";
import { usersQueryKeys } from "../users.api-keys";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import type { UserDto } from "../dtos/user.dto";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "../schemas/user-form.schema";

export type ChangePasswordModalProps = {
  isOpen: boolean;
  user: UserDto;
  onClose: () => void;
};

export default function ChangePasswordModal({
  isOpen,
  user,
  onClose,
}: ChangePasswordModalProps) {
  const queryClient = useQueryClient();

  const passwordMutation = useChangeUserPassword({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
        toast.success("Password changed");
      },
    },
  });

  const loading = passwordMutation.isPending;

  const formik = useAppFormik<ChangePasswordValues>({
    initialValues: {
      password: "",
    },
    validationZodSchema: changePasswordSchema,
    onSubmit: (values) =>
      passwordMutation.mutate(new ChangePasswordDto(user.id, values.password)),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={`Change password — ${user?.username ?? ""}`}
      description="The user will use the new password on next login."
    >
      <form
        className="flex flex-col gap-3 w-full sm:w-[420px]"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField
          type="password"
          name="password"
          title="New password"
          value={formik.values.password}
          helperText={formik.touchedErrors.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="new-password"
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
