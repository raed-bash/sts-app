export type TableDensity = "compact" | "comfortable" | "roomy";

export type TableDensityOption = {
  value: TableDensity;
  label: string;
  padding: string;
};

export const TABLE_DENSITIES: TableDensityOption[] = [
  { value: "compact", label: "table.compact", padding: "py-1 px-2" },
  { value: "comfortable", label: "table.comfortable", padding: "py-3 px-4" },
  { value: "roomy", label: "table.roomy", padding: "py-5 px-5" },
];

export const getTableDensityPadding = (density: TableDensity): string =>
  TABLE_DENSITIES.find((option) => option.value === density)?.padding ??
  TABLE_DENSITIES[1].padding;
