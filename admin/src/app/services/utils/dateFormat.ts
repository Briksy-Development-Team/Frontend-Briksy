type FormatOptions = {
  withRelative?: boolean;
  locale?: string;
};

export const formatDateTime = (
  value?: string | null,
  options: FormatOptions = {}
) => {
  if (!value) return "—";

  const { withRelative = true, locale = "en-IN" } = options;

  // Normalize non-ISO
  const normalized = value.includes(" ") ? value.replace(" ", "T") : value;

  const date = new Date(normalized);
  if (isNaN(date.getTime())) return "—";

  const absolute = date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!withRelative) return absolute;

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  let relative = "";
  if (diffDay > 0) relative = `${diffDay}d ago`;
  else if (diffHr > 0) relative = `${diffHr}h ago`;
  else relative = `${diffMin}m ago`;

  return `${absolute} (${relative})`;
};