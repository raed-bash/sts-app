/**
 * Authors write blanks as [answer]; the API stores them as ;;answer;;
 * (and returns the sentence with ;;;; placeholders + answers by correctIndex).
 */

export type BlanksError =
  "none" | "empty" | "unbalanced" | "nested" | "reserved";

export type ParsedBlanks = {
  /** text around the blanks; segments.length === blanks.length + 1 */
  segments: string[];
  blanks: string[];
  error?: BlanksError;
};

export function parseBlanks(source: string): ParsedBlanks {
  if (source.includes(";;"))
    return { segments: [source], blanks: [], error: "reserved" };

  const segments: string[] = [];
  const blanks: string[] = [];
  let buffer = "";
  let inBlank = false;

  for (const char of source) {
    if (char === "[") {
      if (inBlank) return { segments, blanks, error: "nested" };
      segments.push(buffer);
      buffer = "";
      inBlank = true;
    } else if (char === "]") {
      if (!inBlank) return { segments, blanks, error: "unbalanced" };
      if (!buffer.trim()) return { segments, blanks, error: "empty" };
      blanks.push(buffer.trim());
      buffer = "";
      inBlank = false;
    } else {
      buffer += char;
    }
  }

  if (inBlank) return { segments, blanks, error: "unbalanced" };
  segments.push(buffer);

  return blanks.length === 0
    ? { segments, blanks, error: "none" }
    : { segments, blanks };
}

/** "[π] × [r²]" -> ";;π;; × ;;r²;;" */
export function toApiTemplate(source: string) {
  const { segments, blanks } = parseBlanks(source);
  return segments
    .map((segment, i) =>
      i < blanks.length ? `${segment};;${blanks[i]};;` : segment,
    )
    .join("");
}

/** Stored ";;;;" sentence + answers -> "[a] … [b]" for editing. */
export function fromStored(
  template: string,
  answers: { text: string; correctIndex?: number | null }[],
) {
  const ordered = [...answers].sort(
    (a, b) => (a.correctIndex ?? 0) - (b.correctIndex ?? 0),
  );
  return template
    .split(";;;;")
    .map((segment, i, all) =>
      i < all.length - 1 ? `${segment}[${ordered[i]?.text ?? ""}]` : segment,
    )
    .join("");
}
