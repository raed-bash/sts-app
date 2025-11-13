import { memo, useCallback, useEffect, useState, type ReactNode } from "react";
import Button from "../buttons/Button";
import { ReactComponent as InfoIcon } from "src/assets/icons/info.svg";
import { ReactComponent as ArrowLineDownIcon } from "src/assets/icons/arrow-line-down.svg";
import { EventTarget } from "src/utils/EventTarget";
import ExpandContainer from "./ExpandContainer";

type AccordionProps = {
  name: string;
  onChange: (e: EventTarget<boolean>) => void;
  title: string | number;
  defaultExpaned?: boolean;
  expand: boolean;
  children: ReactNode;
};

function Accordion({
  name,
  onChange = () => {},
  title,
  children = "",
  defaultExpaned = undefined,
  expand: externalExpand,
}: AccordionProps) {
  const [expand, setExpand] = useState<boolean>(defaultExpaned || false);

  const handleToggle = useCallback(() => {
    setExpand(!expand);

    onChange(new EventTarget(name, !expand));
  }, [expand, name, onChange]);

  useEffect(() => {
    if (typeof externalExpand === "boolean" && externalExpand !== expand) {
      setExpand(externalExpand);
    }
  }, [externalExpand, expand]);

  return (
    <div className={` duration-150 ${expand ? "pt-4" : ""}`}>
      <Button
        className="flex items-center justify-between gap-3 "
        onClick={handleToggle}
      >
        <div className="flex gap-3">
          <InfoIcon className="stroke-white" />
          <p className="text-lg">{title}</p>
        </div>
        <span className="bg-white rounded-full px-[10px] py-[12px]">
          <ArrowLineDownIcon
            className={` stroke-primary-main  duration-150 ${
              expand ? "rotate-0" : "rotate-90"
            }`}
          />
        </span>
      </Button>
      <div>
        <ExpandContainer
          expand={expand}
          expanedClassName="mt-8 pt-8 pb-4"
          className="border-t-2 border-solid border-secondary-secondary"
        >
          {children}
        </ExpandContainer>
      </div>
    </div>
  );
}

export default memo(Accordion);
