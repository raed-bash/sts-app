import * as React from "react";

export interface SelectContextValue {
  className?: string;
  "aria-invalid"?: boolean;
}

export const SelectContext = React.createContext<SelectContextValue>({});

export const useSelectContext = () => React.useContext(SelectContext);
