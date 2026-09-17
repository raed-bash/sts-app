import {
  QUESTION_TYPE_TITLES,
  type QuestionType,
} from "@/constants/question-type";
import { cn } from "cn";

export type QuestionTypeBadgeProps = React.ComponentProps<"div"> & {
  type?: QuestionType;
};

const TYPE_STYLES: Record<QuestionType, string> = {
  CHOOSE: "bg-blue-400",
  DRAG_DROP: "bg-purple-400",
  COMPLETE: "bg-teal-400",
};

export default function QuestionTypeBadge({
  type,
  ...props
}: QuestionTypeBadgeProps) {
  return (
    <div
      {...props}
      className={cn(
        "px-2 py-1 inline-block rounded-lg text-white font-bold text-xs",
        type && TYPE_STYLES[type],
        props.className,
      )}
    >
      {type && QUESTION_TYPE_TITLES[type]}
    </div>
  );
}