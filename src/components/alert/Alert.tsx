import InfoIcon from "src/assets/icons/info.svg?react";
import SuccessIcon from "src/assets/icons/success.svg?react";
import WarningIcon from "src/assets/icons/warning.svg?react";

export type AlertProps = {
  children?: React.ReactNode;
  color?: "danger" | "warning" | "info" | "success";
};

export default function Alert({ children, color }: AlertProps) {
  const colorClasses = {
    danger: "bg-(--danger-main)/10 text-(--danger-main)",
    warning: "bg-(--warning-main)/10 text-(--warning-main)",
    info: "bg-(--info-main)/10 text-(--info-main)",
    success: "bg-(--success-main)/10 text-(--success-main)",
  };

  const icons = {
    danger: (
      <InfoIcon className="inline-block me-1 w-6 stroke-(--danger-main)" />
    ),
    warning: (
      <WarningIcon className="inline-block me-1 w-6 stroke-(--warning-main) fill-(--warning-main)" />
    ),
    info: <InfoIcon className="inline-block me-1 w-6 stroke-(--info-main)" />,
    success: (
      <SuccessIcon className="inline-block me-1 w-6 stroke-(--success-main) fill-(--success-main)" />
    ),
  };

  return (
    <div
      className={`p-2 rounded-md flex items-center mt-2 ${colorClasses[color || "info"]}`}
    >
      {icons[color || "info"]}
      <div className="text-[15px] font-medium">{children}</div>
    </div>
  );
}
