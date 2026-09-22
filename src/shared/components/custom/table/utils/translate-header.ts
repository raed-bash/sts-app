import { resolveFieldLabel } from "@/shared/components/custom/filter/utils";

export const translateHeader = (headerName: string): string =>
  resolveFieldLabel(headerName);
