import { useQueryClient } from "@tanstack/react-query";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { SelectItem } from "@/shared/components/ui/select";
import { useAppFormik } from "@/shared/lib/formik";
import { useCreateUser } from "../api/create-user.api";
import { usersQueryKeys } from "../users.api-keys";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ROLE_TITLES, type UserRole } from "@/constants/user-role";
import { STATUS_TITLES, type UserStatus } from "@/constants/user-status";
import {
  createUserFormSchema,
  type CreateUserFormValues,
} from "../schemas/user-form.schema";

export type CreateUserFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateUserFormModal({
  isOpen,
  onClose,
}: CreateUserFormModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
        toast.success("User created");
      },
    },
  });

  const loading = createMutation.isPending;

  const formik = useAppFormik<CreateUserFormValues>({
    initialValues: {
      username: "",
      password: "",
      role: "STUDENT",
      status: "PENDING",
    },
    validationZodSchema: createUserFormSchema,
    onSubmit: (values) => createMutation.mutate(new CreateUserDto(values)),
  });

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Create user">
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
          type="password"
          name="password"
          title="Password"
          value={formik.values.password}
          helperText={formik.touchedErrors.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="new-password"
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
            {loading ? "Saving..." : "Create"}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
