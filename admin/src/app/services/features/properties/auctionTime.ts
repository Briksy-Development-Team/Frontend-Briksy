/** Convert API/database time values to the `H:i` format expected by the API. */
export const normalizeAuctionTime = (value?: string | null): string => {
  if (!value) return "";

  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;

  return `${match[1].padStart(2, "0")}:${match[2]}`;
};
