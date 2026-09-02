import type { useSelectApi } from "@/components/hooks";
import * as React from "react";

export interface SelectApiContextValue {
  listBoxProps?: ReturnType<typeof useSelectApi>["listBoxProps"];

  isFetching?: boolean;

  hasNextPage?: boolean;
}

export const SelectApiContext = React.createContext<SelectApiContextValue>({});

export const useSelectApiContext = () => React.useContext(SelectApiContext);
