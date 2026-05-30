import InfoIcon from "src/assets/icons/info.svg?react";
import SuccessIcon from "src/assets/icons/success.svg?react";
import WarningIcon from "src/assets/icons/warning.svg?react";

export type AlertProps = {
  children?: React.ReactNode;
  color?: "danger" | "warning" | "info" | "success";
};

export default function Alert({ children, color }: AlertProps) {
  const colorClasses = {
    danger: "bg-(--danger)/10 text-(--danger)",
    warning: "bg-(--warning)/10 text-(--warning)",
    info: "bg-(--info)/10 text-(--info)",
    success: "bg-(--success)/10 text-(--success)",
  };

  const icons = {
    danger: <InfoIcon className="inline-block me-1 w-6 stroke-(--danger)" />,
    warning: (
      <WarningIcon className="inline-block me-1 w-6 stroke-(--warning) fill-(--warning)" />
    ),
    info: <InfoIcon className="inline-block me-1 w-6 stroke-(--info)" />,
    success: (
      <SuccessIcon className="inline-block me-1 w-6 stroke-(--success) fill-(--success)" />
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
