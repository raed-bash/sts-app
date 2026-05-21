export function removeEmptyNull(data: any, isArray: boolean = false): any {
  if (Array.isArray(data?.[0]))
    return Object.fromEntries(
      data.map(([key, value]: [string, any]) => [key, removeEmptyNull(value)]),
    );
  else if (Object.prototype.toString.call(data) === "[object Object]")
    return removeEmptyNull(Object.entries(data));
  else if (Array.isArray(data)) {
    const newData: any[] = [];

    if (data.length > 0) {
      data.forEach((val) => {
        const value = removeEmptyNull(val, true);
        if (value === "delete") {
          return;
        }

        newData.push(value);
      });
      if (newData.length === 0) return;

      return newData;
    }
    return;
  } else if (!(data === null || data === "")) return data;
  else if (isArray) return "delete";
}
