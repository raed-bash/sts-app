export function dateFormater(
  date: Date | string | undefined,
  type: "date" | "justYear" = "date",
) {
  if (date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = monthFormater(date.getMonth());
    const day = handleViewFormat(date.getDate());

    if (type === "justYear") {
      return `${year}-${month}-${day}`;
    } else if (type === "date") {
      const hour = hourFormater(date.getHours());
      const minute = handleViewFormat(date.getMinutes());
      const seconds = handleViewFormat(date.getSeconds());
      const isNight = date.getHours() >= 12;
      const pmOrAm = isNight ? "PM" : "AM";

      return `${year}-${month}-${day}, ${hour}:${minute}:${seconds} ${pmOrAm}`;
    }
  } else {
    return "";
  }
}

/**
 *
 * @param {number} month
 */
const monthFormater = (month: number) => {
  month++;
  return handleViewFormat(month);
};

/**
 * @param {number} hour
 */
const hourFormater = (hour: number) => {
  const isGreaterThan12 = (hour: number) => hour > 12;
  const isSmallestThan1 = (hour: number) => hour < 1;

  const localViewHour = (hour: number) => {
    if (isGreaterThan12(hour)) {
      return hour - 12;
    } else if (isSmallestThan1(hour)) {
      return hour + 12;
    }
    return hour;
  };

  hour = localViewHour(hour);

  const viewFormat = handleViewFormat(hour);

  return viewFormat;
};

/**
 *
 * @param {number} value
 */
const handleViewFormat = (value: number) => (value < 10 ? `0${value}` : value);
