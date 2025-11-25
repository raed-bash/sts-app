import { useState, type ReactNode } from "react";
import Button from "../buttons/Button";
import InfoIcon from "src/assets/icons/info.svg?react";
import ArrowLineDownIcon from "src/assets/icons/arrow-line-down.svg?react";
import { EventTarget } from "src/utils/EventTarget";
import ExpandContainer from "./ExpandContainer";

type AccordionProps = {
  title: string | number;
  children: ReactNode;
  name?: string;
  onChange?: (e: EventTarget<boolean>) => void;
  defaultExpaned?: boolean;
  expand?: boolean;
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

  const handleToggle = () => {
    setExpand(!expand);

    if (onChange) {
      onChange(new EventTarget(name, !expand));
    }
  };

  const _expand =
    typeof externalExpand !== "undefined" ? externalExpand : expand;

  return (
    <div className={` duration-150 ${_expand ? "pt-4" : ""}`}>
      <Button
        className="flex items-center justify-between gap-3 "
        onClick={handleToggle}
      >
        <div className="flex gap-3">
          <InfoIcon className="stroke-white" />
          <p className="text-lg">{title}</p>
        </div>
        <span className="bg-white rounded-full px-2.5 py-3">
          <ArrowLineDownIcon
            className={` stroke-primary-main  duration-150 ${
              _expand ? "rotate-0" : "rotate-90"
            }`}
          />
        </span>
      </Button>
      <div>
        <ExpandContainer
          expand={_expand}
          expanedClassName="mt-8 pt-8 pb-4"
          className="border-t-2 border-solid border-secondary-secondary"
        >
          {children}
        </ExpandContainer>
      </div>
    </div>
  );
}

export default Accordion;
