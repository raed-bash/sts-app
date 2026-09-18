export type TableDensity = "compact" | "comfortable" | "roomy";

export type TableDensityOption = {
  value: TableDensity;
  label: string;
  padding: string;
};

export const TABLE_DENSITIES: TableDensityOption[] = [
  { value: "compact", label: "Compact", padding: "py-1 px-2" },
  { value: "comfortable", label: "Comfortable", padding: "py-3 px-4" },
  { value: "roomy", label: "Roomy", padding: "py-5 px-5" },
];

export const getTableDensityPadding = (density: TableDensity): string =>
  TABLE_DENSITIES.find((option) => option.value === density)?.padding ??
  TABLE_DENSITIES[1].padding;