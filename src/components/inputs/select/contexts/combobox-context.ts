import * as React from "react";

export interface ComboboxContextValue {
  className?: string;
  "aria-invalid"?: boolean;
}

export const ComboboxContext = React.createContext<ComboboxContextValue>({});

export const useComboboxContext = () => React.useContext(ComboboxContext);
