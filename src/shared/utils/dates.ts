type DateFormatterFormat = "date" | "datetime";

const pad2 = (value: number) => String(value).padStart(2, "0");

export function dateFormatter(
  date: Date | string | number | null | undefined,
  format: DateFormatterFormat = "datetime",
) {
  if (date == null) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = pad2(parsed.getMonth() + 1);
  const day = pad2(parsed.getDate());
  const datePart = `${year}-${month}-${day}`;

  if (format === "date") {
    return datePart;
  }

  const hours = parsed.getHours();
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${datePart}, ${pad2(hour12)}:${pad2(parsed.getMinutes())}:${pad2(parsed.getSeconds())} ${period}`;
}