export const propertyStatusLabel = (
  purpose?: "SELL" | "RENT" | "BOTH" | null,
  transactionStatus?: "BUY" | "LEASE" | "SOLD" | "LEASED" | null,
  fallback = "Verified listing",
): string => {
  const transactionLabels: Record<string, string> = {
    BUY: "For Sale",
    LEASE: "For Rent",
    SOLD: "Sold",
    LEASED: "Leased",
  };

  if (transactionStatus && transactionLabels[transactionStatus]) {
    return transactionLabels[transactionStatus];
  }

  return ({ SELL: "For Sale", RENT: "For Rent", BOTH: "Sale & Rent" } as Record<string, string>)[purpose || ""] || fallback;
};
