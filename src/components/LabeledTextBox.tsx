import { type ReactNode } from "react";

export type LabeledTextBoxProps = { label: string; children: ReactNode };

function LabeledTextBox({ label, children }: LabeledTextBoxProps) {
  return (
    <div className="flex border-2 border-vehicle-main w-full p-3 rounded-lg text-lg gap-2">
      <p className="text-vehicle-main min-w-max">{label}: </p>
      <div className="text-industrial-main">{children}</div>
    </div>
  );
}

export default LabeledTextBox;
