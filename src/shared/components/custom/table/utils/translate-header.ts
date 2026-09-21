import i18n from "@/i18n";
import { translateDynamic } from "@/shared/lib/translate-dynamic";

export const translateHeader = (headerName: string): string => {
  if (!headerName) return "";
  return translateDynamic((key, options) => i18n.t(key, options), headerName);
};
