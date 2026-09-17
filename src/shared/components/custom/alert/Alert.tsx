import { CircleCheck, Info, TriangleAlert } from "lucide-react";

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
    danger: <Info className="inline-block me-1 w-6 stroke-(--danger)" />,
    warning: (
      <TriangleAlert className="inline-block me-1 w-6 stroke-(--warning)" />
    ),
    info: <Info className="inline-block me-1 w-6 stroke-(--info)" />,
    success: (
      <CircleCheck className="inline-block me-1 w-6 stroke-(--success)" />
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
