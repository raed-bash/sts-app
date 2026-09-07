import type { useSelectApi } from "@/shared/hooks/useSelectApi";
import * as React from "react";

export interface ComboboxApiContextValue {
  listBoxProps?: ReturnType<typeof useSelectApi>["listBoxProps"];

  isFetching?: boolean;

  hasNextPage?: boolean;
}

export const ComboboxApiContext = React.createContext<ComboboxApiContextValue>(
  {},
);

export const useComboboxApiContext = () => React.useContext(ComboboxApiContext);
