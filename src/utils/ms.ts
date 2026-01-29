export function ms(...strings: (string | number)[]) {
  return strings.reduce(
    (prev, curr) => prev + (curr || curr === 0 ? curr : "").toString(),
    "",
  );
}
